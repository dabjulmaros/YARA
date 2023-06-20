const { contextBridge, ipcRenderer } = require('electron');
// const child_process = require('child_process')
const exec = require('child_process').exec;

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  sendSync: (channel, data) => {
    ipcRenderer.sendSync(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  request: async (params) => {
    let command = `node -e 'import("${__dirname}/node/request.cjs").then( loadedModule => loadedModule.request(JSON.stringify(${params})).then(r=>console.log(r)))'`
    const out = await execute(command);
    console.log(out);
    return out;
  }
});

function execute(command) {
  return new Promise(function (resolve, reject) {
    exec(command, function (error, standardOutput, standardError) {
      if (error) {
        reject();
        return;
      }
      if (standardError) {
        reject(standardError);
        return;
      }
      resolve(standardOutput);
    });
  });
}