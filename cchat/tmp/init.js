const ws = require('ws');
const gameobject = require('./netcraft/gameobject.js');
const position = require('./netcraft/transform/position.js');
const size = require('./netcraft/transform/size.js');

module.exports.init = (ctx) => {
    Number.prototype.isInteger = function() {
        return Math.floor(this) == this;
    };
    console.log('init.js');
    const wss = new ws.WebSocketServer({
        port: 35111,
        path: '/',
        host: '0.0.0.0'
    });
    globalThis.BLOCKSIZE = 40;
    ctx.world = [];
    ctx.world.push(new gameobject(new position(0 * BLOCKSIZE, 10 * BLOCKSIZE), new size(BLOCKSIZE, BLOCKSIZE), 'mat_dirt.png'));
    ctx.world.push(new gameobject(new position(1 * BLOCKSIZE, 10 * BLOCKSIZE), new size(BLOCKSIZE, BLOCKSIZE), 'mat_dirt.png'));
    ctx.world.push(new gameobject(new position(2 * BLOCKSIZE, 9 * BLOCKSIZE), new size(BLOCKSIZE, BLOCKSIZE), 'mat_dirt.png'));
    ctx.players = {};
    ctx.broadcast = (msg, except) => {
        if(!except) except = [];
        for (const v of Object.values(ctx.players)) {
            if(except.includes(v.name)) continue;
            v.ws.send(msg);
        }
    };
    wss.on('connection', (client) => {
        console.log('connection');
        client.on('message', (msg) => {
            try {
                var j = JSON.parse(msg);
                var s = require(`./netcraft/packet/${j.packet}.js`);
                if(!s.hasOwnProperty('processReceived')) {
                    return;
                }
                s.processReceived(ctx, j.data, j.id ?? "none", client);
            } catch(err) {
                console.log(err);
            }
        });
        client.on('close', () => {
            ctx.broadcast(JSON.stringify({
                'error': 0, 'success': 1,
                packet: 'removeplayer',
                data: {
                    name: p.name    
                }
            }));
        });
    });
};