const { contextBridge, ipcRenderer } = require('electron');
const { request } = require('http');
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
		const _params = JSON.parse(params);
		let command;
		if (process.platform == 'win32')
			command = `node -e "import(\\"file:\\\\${__dirname.replaceAll(
				'\\',
				'/',
			)}/request.cjs\\").then( loadedModule => loadedModule.request('{\\"r\\":\\"${
				_params.r + '\\'
			}",\\"params\\":\\"${_params.params + '\\'}",\\"over18\\":\\"${
				_params.over18 + '\\'
			}"}')).then(r=>console.log(r))"`;
		else
			command = `node -e 'import("${__dirname}/request.cjs").then( loadedModule => loadedModule.request(JSON.stringify(${params})).then(r=>console.log(r)))'`;
		const out = await execute(command);
		return out;
	},
});

function execute(command) {
	return new Promise(function (resolve, reject) {
		exec(command, function (error, standardOutput, standardError) {
			if (error) {
				console.log(error);
				reject();
				return;
			}
			if (standardError) {
				console.log(error);
				reject(standardError);
				return;
			}
			resolve(standardOutput);
		});
	});
}
