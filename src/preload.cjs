const { contextBridge, ipcRenderer } = require('electron');
const child_process = require('child_process');

const path = require('path')

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
    // const _params = JSON.parse(params);
    // let command;
    // if (process.platform == 'win32')
    //   command = `node -e "import(\\"${path.resolve(__dirname, 'request.cjs')}\\").then( loadedModule => loadedModule.request('{\\"r\\":\\"${_params.r + '\\'
    //     }",\\"params\\":\\"${_params.params + '\\'}",\\"over18\\":\\"${_params.over18 + '\\'
    //     }"}')).then(r=>console.log(r))"`;
    // else
    //   command = `node -e 'import("${path.resolve(__dirname, 'request.cjs')}").then( loadedModule => loadedModule.request(JSON.stringify(${params})).then(r=>console.log(r)))'`;

    // console.log(command);
    // const out = await execute(command);

    //This solutions uses the same node process that is packaged with electron to launch the request script
    //It reads the output from it and returns it.
    let out = "";
    const child = fork(path.resolve(__dirname, 'request.cjs'), [params]);

    child.stdout.on('data', (data) => {
      out+=data;
    });

    child.stderr.on('data', (data) => {
      out+=data;
    });

    await new Promise((resolve) => {
      child.on('close', resolve)
    })

    return out;
  },
});

function fork(module, args) {
  return child_process.fork(module, args, { silent: true });
}
