const BLOCKSIZE = 40;
const cheats = {
    walkingNoclip: false,
    noclip: false,
    noGravity: false,
    flight: false
};
var selectedBlock = [0, 0];
var playerVelocity = [0, 0];
const $PREFIX = (a) => {
    if (document.location.port != '') {
        return '/' + a;
    } else {
        return '/netcraft/' + a;
    }
};

const $GJSCRIPTS = (a) => {
    return $PREFIX('gjscripts/' + a);
};

if (document.location.hostname != 'darkcoder15.tk') ban();

function ban() {
    document.location.href = 'http://darkcoder15.tk/0FD3E7AEE3E8417FB04BA546AD505208.html';
}

class Player extends gameobject {
    constructor(name, position) {
        super(position, new size(40, 50), RenderingType.texture, $assets['playerrighty.png'], $renderCanvas, 'player');
        this.name = name;
        (async () => {
            let a = await fetch($GJSCRIPTS('player.js'));
            let b = await a.text();
            this.scripts.add(new script({}, this, b));
            this.scripts.execAll();
        })();

    };

    isLocalPlayer() {
        return this.id == lp.player.id;
    };

    direction(v) {
        if (!v) return this.__direction;
        this.__direction = v;
        this.renderTexture = (() => {
            if (this.__direction > 0) {
                return $assets['playerrighty.png'];
            } else if (this.__direction < 0) {
                return $assets['playerlefty.png'];
            } else {
                return nullImage();
            }
        })();
    };

    name;
    __direction = 1;
}

class LocalPlayer {
    constructor(name) {
        var ws = new WebSocket('ws://darkcoder15.tk:35111/');
        var p = new Player(name, new position(0, 0));
        $scene.push(p);
        this.player = p;
        ws.onmessage = (ev) => {
            wsdata(JSON.parse(ev.data));
        };
        ws.onopen = (ev) => {
            console.log('Websocket open');
            ws.send(JSON.stringify({
                packet: 'connect',
                data: {
                    name: name
                }
            }));
        };

        (async () => {
            let a = await fetch($GJSCRIPTS('localplayer.js'));
            let b = await a.text();
            p.scripts.add(new script({}, p, b));
        })();

        this.ws = ws;
        this.name = name;
        this.id = $randomText(100);
    };

    updateServerPosition(mx, my) {
        if (!mx) mx = 0;
        if (!my) my = 0;
        if (this.player.transform.position.x + mx > this.player.transform.position.x) this.player.direction(1);
        else if (this.player.transform.position.x + mx < this.player.transform.position.x) this.player.direction(-1);
        //console.info(`Local player (Update Server Position) Current: [${this.player.transform.position.x} ${this.player.transform.position.y}]; Modifiers: [${mx} ${my}]`);
        this.player.transform.position.x += mx;
        this.player.transform.position.y += my;

        this.ws.send(JSON.stringify({
            packet: 'move',
            id: this.id, // ID
            data: {
                x: this.player.transform.position.x,
                y: this.player.transform.position.y
            }
        }));
    };



    ws;
    name;
    id;
    player;
}

if (document.location.hostname != 'darkcoder15.tk') ban();

setTimeout(() => {
    try {
        if ($0 != undefined) {
            ban();
        }
    } catch (err) {

    }
}, 1000);

var defaultCanvas;
var lp;
var matTextures;
var pressedKeys = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    $renderCanvas = createGraphics(windowWidth, windowHeight);
    $background = '58, 194, 228';
    document.title = "darkcoder15.tk/netcraft";
    //foto1 = nullImage(640, 480);
}

function startbtn_clicked() {
    document.getElementById('startbtn').hidden = true;
    setupEngine();
}

function onReady() {
    matTextures = {};
    for (const key of Object.keys($assets)) {
        console.log(key);
        if (key.startsWith('mat_')) {
            console.log('v');
            matTextures[key] = $assets[key];
        }
    }
    lp = new LocalPlayer('name' + $randomText(4));
    lp.player.scripts.add(new script({}, lp.player, `var g = 0.3;
    var vg = 0;
    
    this.loops.push(() => {
        if(cheats.noGravity && !pressedKeys.includes('s')) return;
        const cv = this.gameobject.renderCanvas;
        const transf = this.gameobject.transform;
        cv.push();
        cv.noFill();
        cv.stroke(255, 0, 0);
        cv.strokeWeight(1);
        cv.rect(transf.position.x, transf.position.y, transf.size.width, transf.size.height);
        cv.pop();
        var a = false;

        $scene.forEach((gj) => {
            if(gj.intersectsWith(this.gameobject) && gj.id != this.gameobject.id) {
                this.gameobject.transform.position.y = gj.transform.position.y - this.gameobject.transform.size.height;
                vg = 0;
                a = true;
            }
        });
        if(a) return;
        vg += g;
        lp.updateServerPosition(0, vg);
    
    });`));
    eventHandlers.keyPressed.push((k) => {
        if (k == 'd') {
            playerVelocity[0] = 1;
        } else if (k == 'a') {
            playerVelocity[0] = -1;
        } else if (k == ' ') {
            jumping = true;
            playerVelocity[1] = 15;
        }
        pressedKeys.push(k);
    });
    eventHandlers.keyReleased.push((k) => {
        if (k == 'd' || k == 'a') {
            playerVelocity[0] = 0;
        }
        pressedKeys = pressedKeys.filter(x => x != k);
    });
    eventHandlers.mouseMoved.push((x, y, p) => {

    });
}

function wsdata(data) {
    if(globalThis.hasOwnProperty("enablepacketlogging")) {
        console.groupCollapsed(`Пакет получен`);
        console.info(`
            Пакет получен
            Успех: ${data.success ?? 'не указано'}
            Ошибка: ${data.error ?? 'не указано'}
            Тип: ${data.packet ?? 'не указано'}
        `);
        console.info(JSON.stringify(data));
        console.groupEnd();
    };
    if(data.packet) {
        if(data.packet == 'HELLO') {
            lp.id = data.data.id;
        }; 
        if(data.packet == 'addplayer') {
            if (data.data.name == lp.name) return;
            $scene.push(new Player(data.data.name, data.data.transform.position));
        };
        if(data.packet == 'addobject') {
            const gj = gameobject.deserialize(data.data);
            $scene.push(gj);
            gjmat(gj);
        };
        if(data.packet == 'removeobject') {
            $scene = $scene.filter((x) => x.id != data.data.id);
        };
        if(data.packet == 'removeplayer') {
            $scene = $scene.filter((x) => x.hasOwnProperty('name') && x.name != data.data.name);
        };
        if(data.packet == 'moveobject') {
            const object = $objectById(data.data.id);
            object.transform.position = new position(data.data.x, data.data.y);
        };
        if(data.packet == 'sizeobject') {
            const object = $objectById(data.data.id);
            object.transform.size = new size(data.data.width, data.data.height);
        };
        if(data.packet == 'moveplayer') {
            const object = $scene.filter((x) => x.hasOwnProperty('name') && x['name'] == data.data.name)[0];
            if(!object.isLocalPlayer()) {
                if(data.data.x > object.transform.position.x) object.direction(1);
                else if(data.data.x < object.transform.position.x) object.direction(-1);
            }
            object.transform.position = new position(data.data.x, data.data.y);
        };
        if(data.packet == 'sizeplayer') {
            const object = $scene.filter((x) => x.hasOwnProperty('name') && x['name'] == data.data.name)[0];
            object.transform.size = new size(data.data.width, data.data.height);
        };
    };
}

function gjmat(gj) {
    gj.renderingType = RenderingType.texture;
    gj.renderTexture = matTextures[gj.material] ?? nullImage();
}

function windowResized() {

}

var jumping = false;

function p5_draw() {
    if (playerVelocity[0] != 0 || playerVelocity[1] != 0) {
        /*if(!jumping)*/playerVelocity[1] -= 1.25;
        //else playerVelocity[1]+=1.25;
        //if(playerVelocity[1] > 10) jumping = false;
        if (playerVelocity[1] < 0) playerVelocity[1] = 0;
        //lp.updateServerPosition(playerVelocity[0], -playerVelocity[1]);
        lp.player.transform.position.x += playerVelocity[0];
        lp.player.transform.position.y += -playerVelocity[1];
        var cancelled = false;
        function cancel() {
            lp.player.transform.position.x -= playerVelocity[0];
            lp.player.transform.position.y -= -playerVelocity[1];
            cancelled = true;
        }

        if (cheats.walkingNoclip == false) {
            for (const gj of $scene) {
                if (!gj.hasOwnProperty('name')) {
                    if (gj.intersectsWith(lp.player) && !(lp.player.transform.bottom() == gj.transform.top())) {
                        cancel();
                        break;
                    }
                }
            }
        }

        if (lp.player.transform.position.x + playerVelocity[0] > lp.player.transform.position.x) lp.player.direction(1);
        else if (lp.player.transform.position.x + playerVelocity[0] < lp.player.transform.position.x) lp.player.direction(-1);
        if (!cancelled)
            lp.updateServerPosition(0, 0);
    }
    $renderCanvas.push();
    $renderCanvas.noFill();
    $renderCanvas.stroke(0, 255, 0);
    $renderCanvas.strokeWeight(2);
    selectedBlock = [Math.floor(mouseX / BLOCKSIZE), Math.floor(mouseY / BLOCKSIZE)];
    $renderCanvas.rect(Math.floor(mouseX / BLOCKSIZE) * BLOCKSIZE, Math.floor(mouseY / BLOCKSIZE) * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
    $renderCanvas.pop();
}