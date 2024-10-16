// const windowStateManager = require('electron-window-state');
import windowStateManager from "electron-window-state";
// const { app, BrowserWindow, shell, dialog } = require('electron');
import { app, BrowserWindow, shell, dialog } from "electron";
// const contextMenu = require('electron-context-menu').default;
import contextMenu from 'electron-context-menu';
// const serve = require('electron-serve');
import serve from "electron-serve"
// const path = require('path');  
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const { exec } = require('child_process');
import { exec } from "child_process";

import { hrValues } from "./lib/hr/utils/hrValues.js";
let values = null;
try {
  // const { hrValues } = require('./lib/hr/utils/hrValues.js');
  values = hrValues;
  console.log("cdn = " + values);
} catch (error) {
  console.error(error);
}

import { createRequire } from "module";
const require = createRequire(import.meta.url);
try {
  require('electron-reloader')(module);
} catch (e) {
  console.error(e);
}
// const path = require('path');
// const serve = require('electron-serve');
// const windowStateManager = require('electron-window-state');

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
let mainWindow;
let over18 = false;
let localStorage = {};

function createWindow() {
  let windowState = windowStateManager({
    defaultWidth: 800,
    defaultHeight: 600,
  });

  const mainWindow = new BrowserWindow({
    backgroundColor: 'whitesmoke',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#11191f',
      symbolColor: '#1095c1',
      height: 30,
    },
    // autoHideMenuBar: true,
    // trafficLightPosition: {
    //   x: 17,
    //   y: 32,
    // },
    minHeight: 450,
    minWidth: 500,
    webPreferences: {
      // webviewTag: true, //tab-groups
      enableRemoteModule: true,
      contextIsolation: true,
      nodeIntegration: true,
      spellcheck: false,
      devTools: true, //dev,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  });

  windowState.manage(mainWindow);

  mainWindow.once('ready-to-show', async () => {
    mainWindow.show();
    mainWindow.focus();

    await mainWindow.webContents.executeJavaScript('({...localStorage});', true).then((ls) => {
      localStorage = ls;
    });

    if (localStorage['over18']) over18 = JSON.parse(localStorage['over18']);
    else
      mainWindow.webContents.executeJavaScript(
        `localStorage.setItem('over18', ${over18})`,
        true,
      );
  });

  mainWindow.on('close', () => {
    windowState.saveState(mainWindow);
  });

  //cors
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details;
    if (values) {
      if (details.url.includes(values)) {
        // if (details.url.includes(values)) {
        details.referrer = details.url;
        requestHeaders.Referer = details.url;

        // requestHeaders["accept"] = "*/*";
        // requestHeaders["accept-encoding"] = "identity;q=1, *;q=0";
        // requestHeaders["sec-fetch-site"] = "same-origin";
        // requestHeaders["sec-fetch-mode"] = "no-cors";
        // requestHeaders["sec-fetch-des"] = "video";

        // console.log('----REQUEST----');
        // console.log(details);
        // console.log('----END REQUEST----');
      }
    }

    UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
    // details.requestHeaders = requestHeaders;
    // callback(details);
    callback({ requestHeaders });
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    // console.log('----RESPONSE----');
    // console.log(details);
    // console.log('----END RESPONSE----');
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    // details.responseHeaders = responseHeaders;
    // callback(details);
    callback({
      responseHeaders,
      ...details.requestHeaders,
    });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('localhost')) return { action: 'deny' };
    if (
      dialog.showMessageBoxSync({
        message: `Open ${url} in external browser?`,
        type: 'question',
        buttons: ['Ok', 'Cancel'],
      }) == 0
    )
      shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

//https://github.com/sindresorhus/electron-context-menu
contextMenu({
  showSelectAll: false,
  showLookUpSelection: true,
  // showSearchWithGoogle: true,
  showCopyImage: true,
  showSaveImageAs: true,
  showCopyLink: true,
  prepend: (defaultActions, parameters, browserWindow) => [
    {
      label: 'Open In Browser',
      visible: parameters.linkURL !== '',
      click: () => {
        shell.openExternal(parameters.linkURL);
      },
    },
    {
      label: 'Open In Browser',
      visible: parameters.mediaType == 'image',
      click: () => {
        shell.openExternal(parameters.srcURL);
      },
    },
  ],

  append: (defaultActions, parameters, browserWindow) => [
    {
      label: 'Show Over 18 Content',
      visible: over18 == false,
      click: () => {
        appOver18();
      },
    },
    {
      label: 'Hide Over 18 Content',
      visible: over18 == true,
      click: () => {
        appOver18();
      },
    },
    {
      label: 'Open In Incognito',
      visible: parameters.linkURL !== '',
      click: () => {
        try {
          exec(`start chrome.exe ${parameters.linkURL} --incognito`);
        } catch (e) {
          dialog.showMessageBoxSync({
            message: `Open ${url} in external browser?`,
            type: 'error',
            title: 'Error Opening link in incognito chrome',
          });
        }
      },
    },
  ],
});

function loadVite(port) {
  mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
    console.error('Error loading URL, retrying', e);
    setTimeout(() => {
      loadVite(port);
    }, 200);
  });
}

function createMainWindow() {
  mainWindow = createWindow();
  mainWindow.once('close', () => {
    mainWindow = null;
  });

  if (dev) loadVite(port);
  else serveURL(mainWindow);
}

app.once('ready', createMainWindow);
app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//cors work around https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
function UpsertKeyValue(obj, keyToChange, value) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      // Reassign old key
      obj[key] = value;
      // Done
      return;
    }
  }
  // Insert at end instead
  obj[keyToChange] = value;
}

function appOver18() {
  over18 = !over18;
  mainWindow.webContents.executeJavaScript(`localStorage.setItem('over18', ${over18})`, true);
}
