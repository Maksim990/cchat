const CONFIG = require('./config.json');
const routing = require('./routing');
const colors = require('colors');
const moment = require('moment');
const https = require('https');
const http = require('http');
const url = require('url'); 
const fs = require('fs');

const ctx = {};
let python;

globalThis.photonUsePython = false;
process.env.PYTHON_BIN = CONFIG.python;

if(photonUsePython) python = require('pythonia').python;

const PHOTON = `
  _____  _    _  ____ _______ ____  _   _ 
 |  __ \\| |  | |/ __ \\__   __/ __ \\| \\ | |
 | |__) | |__| | |  | | | | | |  | |  \\| |
 |  ___/|  __  | |  | | | | | |  | | . \\ |
 | |    | |  | | |__| | | | | |__| | |\\  |
 |_|    |_|  |_|\\____/  |_|  \\____/|_| \\_|
                                          
                                          `.replace('\r', '');
function log(p, m) {
	console.log(`${moment().format('MMMM Do YYYY HH:mm:ss')} [${p}] ${m}`);
}
ctx.log = log;
ctx.config = CONFIG;

log('INFO', 'PHOTON Webserver is starting...');
log('INFO', 'PHOTON Version - ' + CONFIG.version);
PHOTON.split('\n').forEach((x) => log('INFO', colors.yellow(x)));

let server = new http.Server(async(req, res) => {
    try {
		const urlParsed = url.parse(req.url);
		//let path = urlParsed.pathname;
		var jsonString = "";
		req.on('data', data => {
			//let d = data.toString();
			jsonString = jsonString + data;
		});
		
		req.on('end', async () => {
			await routing.define(req, res, jsonString, ctx);
		});
    } catch(err) {
		console.log(err.stack);
    }
});

const init = async() => {
	const jsInit = require('./init.js');
	jsInit.init(ctx);
	/*if (!photonUsePython) return;
	const pyInit = await python('./init.py');
	await pyInit.init(ctx);*/
};

init();

server.listen(CONFIG.port);
log('INFO', 'PHOTON Webserver listening at ' + CONFIG.port);