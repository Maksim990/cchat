function $appendFunc(name, func, args) {
    var f = eval(name);
    if (!f) return 0;
    if (f) eval(`
    ${name} = (${args}) => {
        f(${args});
        func(${args});
    };
    `);
} function $insertFunc(name, func, args) {
    var f = eval(name);
    if (!f) return 0;
    if (f) eval(`
    ${name} = (${args}) => {
        if(func(${args}))
        f(${args});
    };
    `);
} function $randomText(len) {
    let ch = 'ABCDEF0123456789';
    let res = '';
    for (let i = 0; i < len; i++) {
        res += ch[Math.floor(random(ch.length))];
    }
    return res;
}

const SceneLevel = {
    before: -1,
    noRender: 0,
    after: 1
};

function nullImage(w, h) {
    var a = createGraphics(64, 64);
    a.background(0);
    a.fill(255);
    a.noStroke();
    a.fill(255, 0, 255);
    a.rect(0, 0, 32, 32);
    a.rect(32, 32, 32, 32);

    a.remove();
    return a;
}

function $now() {
    var d = new Date();
    return `${('000' + d.getDate()).slice(-2)}.${('000' + d.getMonth()).slice(-2)}.${d.getFullYear()} ${('000' + d.getHours()).slice(-2)}:${('000' + d.getMinutes()).slice(-2)}:${('000' + d.getSeconds()).slice(-2)}`;
}

var $console;

function $objectById(id) {
    return $scene.filter((x) => x.id == id)[0];
}

function preload() {
    $console = document.getElementById('console');
    if ($console) $console.hidden = true;
    console.reallyLog = console.log;
    console.reallyDebug = console.debug;
    console.reallyWarn = console.warn;
    console.reallyError = console.error;
    console.reallyInfo = console.info;
    console.log = function (a) {
        a = `${$now()} [LOG] ${a}`;
        console.reallyLog(a);
        if ($console) $console.innerHTML += (a + '<br>\n');
    };
    console.debug = function (a) {
        a = `${$now()} [DEBUG] ${a}`;
        console.reallyDebug(a);
        if ($console) $console.innerHTML += (a + '<br>\n');
    };
    console.warn = function (a) {
        a = `${$now()} [WARNING] ${a}`;
        console.reallyWarn(a);
        if ($console) $console.innerHTML += (a.fontcolor('orange') + '<br>\n');
    };
    console.error = function (a) {
        a = `${$now()} [ERROR] ${a}`;
        console.reallyError(a);
        if ($console) $console.innerHTML += (a.fontcolor('red') + '<br>\n');
    };
    console.info = function (a) {
        a = `${$now()} [INFO] ${a}`;
        console.reallyInfo(a);
        if ($console) $console.innerHTML += (a.fontcolor('blue') + '<br>\n');
    };
}

function $rectanglesIntersect(r1, r2) {
    return !(r2.left() > r1.right() ||
        r2.right() < r1.left() ||
        r2.top() > r1.bottom() ||
        r2.bottom() < r1.top());
}

// function $rectanglesIntersect2(r1, r2) {
//     if(r2.left() < r1.right())
//     return [false, undefined];
// }


function draw() {
    background(0);
    if (!_$$_setupEngine) {
        $renderCanvas.push();
        $renderCanvas.background('#0080b3');
        $renderCanvas.textAlign(CENTER, CENTER);
        $renderCanvas.textSize(36);
        $renderCanvas.stroke(0);
        $renderCanvas.fill(255);
        $renderCanvas.text('netcraft engine\nне запущено', $renderCanvas.width / 2, $renderCanvas.height * (2 / 3));
        $renderCanvas.pop();
        image($renderCanvas, 0, 0, width, height);
        return;
    }
    if (globalThis.hasOwnProperty('p5_draw')) {
        p5_draw();
    }
    image($renderCanvas, 0, 0, width, height);
}

var cameraPos = {
    x: 0,
    y: 0
};
var _$$_setupEngine = false;

var eventHandlers = {
    mousePressed: [],
    mouseReleased: [],
    keyPressed: [],
    keyReleased: [],
    keyTyped: [],
    mouseMoved: []
};

function touchStarted() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.mousePressed) {
        var y = x(mouseX, mouseY);
        if (y == false) break;
    }
    return false;
}

function touchEnded() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.mouseReleased) {
        var y = x(mouseX, mouseY);
        if (y == false) break;
    }
    return false;
}

function touchMoved() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.mouseMoved) {
        var y = x(mouseX, mouseY, mouseIsPressed, pmouseX, pmouseY);
        if (y == false) break;
    }
    return false;
}

function keyPressed() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.keyPressed) {
        var y = x(key, keyCode);
        if (y == false) break;
    }
    return false;
}

function keyTyped() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.keyTyped) {
        var y = x(key, keyCode);
        if (y == false) break;
    }
    return false;
}

function keyReleased() {
    if (!_$$_setupEngine) return false;
    for (var x of eventHandlers.keyReleased) {
        var y = x(key, keyCode);
        if (y == false) break;
    }
    return false;
}

function setupEngine() {

    (async () => {
        let a = await fetch('assets/list.json');
        let b = await a.json();
        let g = 0;
        let m = 0;
        for (const c of Object.keys(b)) {
            console.debug(c);
            m += b[c].length - 1;
            b[c].forEach((d, i) => {
                console.debug(d);
                console.debug(i);
                let code = `${c}("assets/" + ${JSON.stringify(d)}, (amogus) => {
                        $assets[${JSON.stringify(d)}] = amogus;
                        console.log('loaded');
                        g++;
                    }, (err) => {
                        if(err) console.error(err.stack);
                    });`;
                console.log(code);
                eval(code);
            });
        }
        let bhga = setInterval(() => {
            if (g >= m) {
                if (globalThis.hasOwnProperty('onReady')) {
                    globalThis.onReady();
                }
                clearInterval(bhga);
            }
            console.log(`${g} ${m}`);
        }, 3000);
    })();

    var a = draw;
    var b = 0;
    var c = false;

    _$$_setupEngine = true;

    draw = () => {
        if (c) return;
        $renderCanvas.push();
        $renderCanvas.background(33, 33, 33);
        $renderCanvas.textSize(20);
        $renderCanvas.noStroke();
        $renderCanvas.fill(255);
        $renderCanvas.textAlign(CENTER, CENTER);
        $renderCanvas.text('запуск...', $renderCanvas.width / 2, $renderCanvas.height * (19 / 40));
        $renderCanvas.textSize(36);
        $renderCanvas.text('netcraft engine', $renderCanvas.width / 2, $renderCanvas.height * (21 / 40));
        $renderCanvas.fill(0, 255, 0);
        $renderCanvas.stroke(255);
        $renderCanvas.rect($renderCanvas.width / 2 - (200), $renderCanvas.height * (31 / 40), b * 2, 40);
        if (frameCount % 2 == 0) b++;
        if (b > 200) {
            c = true;
        }
        $renderCanvas.noStroke();
        $renderCanvas.fill(255);
        $renderCanvas.stroke(0);
        $renderCanvas.text(Math.floor(b / 2) + '%', $renderCanvas.width / 2, $renderCanvas.height * (32 / 40));
        $renderCanvas.pop();
        background(0);
        image($renderCanvas, 0, 0, width, height);
        if (c) {
            //eventHandlers = {
            //    mousePressed: [],
            //    mouseReleased: [],
            //    keyPressed: [],
            //    keyReleased: [],
            //    keyTyped: [],
            //    mouseMoved: []
            //};
            $renderCanvas.background('#333333');
            c = false;
            draw = a;
            $insertFunc('draw', () => {
                eval(`$renderCanvas.background(${$background})`);
                if ($sceneLevel == SceneLevel.before) {
                    $render(cameraPos.x, cameraPos.y, $renderCanvas);
                }
                return true;
            }, '');

            $appendFunc('draw', () => {
                if ($sceneLevel == SceneLevel.after) {
                    throw new Error('scene after rendering currently not supported');
                    debugger;
                    $scene.forEach((x) => { x.render(); });
                }
            }, '');

        }
    };



}

function $render(x, y, canvas) {
    if (!_$$_setupEngine) return false;
    $scene.forEach((a) => {
        a.render(canvas, x, y);
    });
}

var $assets;
var $scene = {};
var $sceneLevel;
var $background;
var $renderCanvas;
$insertFunc('preload', () => {
    $assets = {};
    $scene = [];
    $sceneLevel = SceneLevel.before;
    $background = '40';
    console.log('Netcraft Engine is preloading');
    return true;
}, '');

const RenderingType = {
    color: 1,
    texture: 2,
    line: 3,
    ellipse: 4
};

class rgbcolor {
    r;
    g;
    b;

    constructor(r, g, b) {
        if (!_$$_setupEngine) return false;
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class scripts {
    constructor() {
        if (!_$$_setupEngine) return false;
        this._internal_array = {};
    };

    _internal_array;
    add(script) {
        if (!_$$_setupEngine) return false;
        let id = $randomText(64);
        this._internal_array[id] = script;
        script.id = id;
        return id;
    };

    remove(id) {
        if (!_$$_setupEngine) return false;
        delete this._internal_array[id];
    };

    clear() {
        if (!_$$_setupEngine) return false;
        this._internal_array = {};
    };

    all() {
        if (!_$$_setupEngine) return false;
        let a = [];
        Object.keys(this._internal_array).forEach((x) => {
            a.push(this._internal_array[x]);
        });
        return a;
    };

    execAll() {
        if (!_$$_setupEngine) return false;
        this.all().forEach((x) => {
            x.exec();
        });
    };
}

class script {
    constructor(importing, gameobject, __string) {
        if (!_$$_setupEngine) return false;
        this.importing = importing;
        this.exporting = {};
        this.loops = [];
        this.gameobject = gameobject;
        this.__string = __string;
    };

    exec() {
        if (!_$$_setupEngine) return false;
        eval(this.__string);
    };

    gameobject;
    loops;
    exporting;
    importing;
    __string;
}

class gameobject {
    constructor(position, size, renderingType, renderTexture, renderCanvas, mat) {
        if (!_$$_setupEngine) return false;
        this.transform = new transform();
        this.transform.position = position;
        this.transform.size = size;
        this.transform.rotation = 0;
        this.renderingType = renderingType;
        this.renderTexture = renderTexture;
        this.renderCanvas = renderCanvas;
        this.scripts = new scripts();
        this.material = mat;
        this.id = $randomText(1000);
    };

    id;

    serialize(withScripts) {
        if (!_$$_setupEngine) return false;
        return JSON.stringify({
            position: this.transform.position,
            size: this.transform.size,
            rot: this.transform.rotation,
            mat: this.material,
            scripts: withScripts ? this.scripts : null,
            id: this.id
        });
    };

    static deserialize(str) {
        if (!_$$_setupEngine) return false;
        var a = JSON.parse(str);
        var gj = new gameobject(new position(a.position.x, a.position.y), new size(a.size.width, a.size.height), RenderingType.texture, nullImage(), $renderCanvas, a.mat);
        gj.id = a.id;
        if (a.scripts != null) gj.scripts = a.scripts;
        return gj;
    };

    intersectsWith(anotherObject) {
        return this.transform.intersectsWith(anotherObject);
    }

    material;
    transform;
    renderingType;
    renderTexture;
    renderCanvas;
    scripts;
    render(c, x, y) {
        if (!_$$_setupEngine) return false;
        this.scripts.all().forEach((a) => {
            a.loops.forEach((b) => {
                b();
            });
        });
        this.transform.position.x += x;
        this.transform.position.y += y;
        c.push();

        if (this.renderingType == RenderingType.color) {
            c.angleMode(DEGREES);
            c.rotate(this.transform.rotation);
            c.noStroke();
            c.colorMode(RGB);
            c.fill(this.renderTexture.r, this.renderTexture.g, this.renderTexture.b);
            c.rect(this.transform.position.x, this.transform.position.y, this.transform.size.width, this.transform.size.height);
        } else if (this.renderingType == RenderingType.ellipse) {
            c.angleMode(DEGREES);
            c.rotate(this.transform.rotation);
            c.noStroke();
            c.colorMode(RGB);
            c.fill(this.renderTexture.r, this.renderTexture.g, this.renderTexture.b);
            c.ellipse(this.transform.position.x, this.transform.position.y, this.transform.size.width, this.transform.size.height);
        } else if (this.renderingType == RenderingType.line) {
            c.angleMode(DEGREES);
            c.rotate(this.transform.rotation);
            c.noStroke();
            c.colorMode(RGB);
            c.fill(this.renderTexture.r, this.renderTexture.g, this.renderTexture.b);
            c.line(this.transform.position.x, this.transform.position.y, this.transform.position.x + this.transform.size.width, this.transform.position.y + this.transform.size.height);
        } else if (this.renderingType == RenderingType.texture) {
            c.angleMode(DEGREES);
            c.rotate(this.transform.rotation);
            c.noStroke();
            c.colorMode(RGB);
            c.image(this.renderTexture, this.transform.position.x, this.transform.position.y, this.transform.size.width, this.transform.size.height);
        }

        c.pop();

        this.transform.position.x -= x;
        this.transform.position.y -= y;
    };
}

class transform {
    position; // position
    size;     // size
    rotation; // Number

    intersectsWith(anotherObject) {
        return $rectanglesIntersect(this, anotherObject.transform ?? anotherObject);
    };

    left() {
        return this.position.x;
    };

    right() {
        return this.position.x + this.size.width;
    };

    top() {
        return this.position.y;
    };

    bottom() {
        return this.position.y + this.size.height;
    };
}

class position {
    constructor(x, y) {
        if (!_$$_setupEngine) return false;
        this.x = x;
        this.y = y;
    };

    plus(b) {
        if (!_$$_setupEngine) return false;
        var a = this;
        return new position(a.x + b.x, a.y + b.y);
    };

    minus(b) {
        if (!_$$_setupEngine) return false;
        var a = this;
        return new position(a.x - b.x, a.y - b.y);
    };

    multiply(b) {
        if (!_$$_setupEngine) return false;
        var a = this;
        if (typeof b == 'number' || typeof b == 'bigint') {
            return new position(a.x * b, a.y * b);
        }

        if (typeof b == 'object') {
            if (b.hasOwnProperty('push') && b.hasOwnProperty('pop'))
                return new position(a.x * b[0], a.y * b[1]);
            if (b.hasOwnProperty('__NETCRAFT_ENGINE_TYPE') && b.__NETCRAFT_ENGINE_TYPE == 'position')
                return new position(a.x * b.x, a.y * b.y);
        }
    };

    divide(b) {
        if (!_$$_setupEngine) return false;
        var a = this;
        if (typeof b == 'number' || typeof b == 'bigint') {
            return new position(a.x / b, a.y / b);
        }

        if (typeof b == 'object') {
            if (b.hasOwnProperty('push') && b.hasOwnProperty('pop'))
                return new position(a.x / b[0], a.y / b[1]);
            if (b.hasOwnProperty('__NETCRAFT_ENGINE_TYPE') && b.__NETCRAFT_ENGINE_TYPE == 'position')
                return new position(a.x / b.x, a.y / b.y);
        }
    };

    toSize() {
        if (!_$$_setupEngine) return false;
        return new size(this.x, this.y);
    }

    x;
    y;
}

class size {
    constructor(width, height) {
        if (!_$$_setupEngine) return false;
        this.width = width;
        this.height = height;
    };

    toPosition() {
        if (!_$$_setupEngine) return false;
        return new position(this.width, this.height);
    };

    plus(b) {
        if (!_$$_setupEngine) return false;
        var c = b.toPosition();
        var a = this.toPosition();
        return (a.plus(c)).toSize();
    };


    minus(b) {
        if (!_$$_setupEngine) return false;
        var c = b.toPosition();
        var a = this.toPosition();
        return (a.minus(c)).toSize();
    };


    multiply(b) {
        if (!_$$_setupEngine) return false;
        var c = b.toPosition();
        var a = this.toPosition();
        return (a.multiply(c)).toSize();
    };


    divide(b) {
        if (!_$$_setupEngine) return false;
        var c = b.toPosition();
        var a = this.toPosition();
        return (a.divide(c)).toSize();
    };

    width;
    height;
}

$appendFunc.prototype.__NETCRAFT_ENGINE_TYPE = "HELPER_FUNCTION";
$insertFunc.prototype.__NETCRAFT_ENGINE_TYPE = "HELPER_FUNCTION";
$randomText.prototype.__NETCRAFT_ENGINE_TYPE = "HELPER_FUNCTION";
gameobject.prototype.__NETCRAFT_ENGINE_TYPE = "gameobject";
position.prototype.__NETCRAFT_ENGINE_TYPE = "position";
size.prototype.__NETCRAFT_ENGINE_TYPE = "size";
rgbcolor.prototype.__NETCRAFT_ENGINE_TYPE = "color";
scripts.prototype.__NETCRAFT_ENGINE_TYPE = "scripts";
RenderingType.__NETCRAFT_ENGINE_TYPE = "enum";
SceneLevel.__NETCRAFT_ENGINE_TYPE = "enum";
$scene.__NETCRAFT_ENGINE_TYPE = "SERVICE_VARIABLE";










/* * * * * * * * * * * * * * * * * * * *
 * WebForms Library by DarkCoder15     *
 * Telegram: @DarkCoder15              *
 * Discord: DarkCoder15#3636           *
 * (Modified for Netcraft Engine)      *
 * * * * * * * * * * * * * * * * * * * */

function setCookie(e, o, t) { document.cookie = e.hexEncode() + "=" + JSON.stringify(o).hexEncode() + ";" + (null == t ? "" : " expires=; ") } function getCookies() { let e = document.cookie.replace(" ", "").split(";"), o = {}; return e.forEach((function (e) { let t = e.split("="), n = t[0].hexDecode(), i = t[1].hexDecode(); o[n] = JSON.parse(i) })), o } function delCookie(e) { setCookie(e, "null", "Thu, 01 Jan 1970 00:00:00 GMT", !1) } function getCookie(e) { return getCookies()[e] } String.prototype.hexEncode = function () { var e, o = ""; for (e = 0; e < this.length; e++)o += ("000" + this.charCodeAt(e).toString(16)).slice(-4); return o }, String.prototype.hexDecode = function () { var e, o = this.match(/.{1,4}/g) || [], t = ""; for (e = 0; e < o.length; e++)t += String.fromCharCode(parseInt(o[e], 16)); return t };

function isMouseIn(element) {
    let x1 = element.x + (element.parent ? element.parent.x : 0);
    let y1 = element.y + (element.parent ? element.parent.y : 0);
    let x2 = x1 + element.width;
    let y2 = y1 + element.height;
    if (mouseX < x2 && mouseX > x1 && mouseY > y1 && mouseY < y2) return true;
    return false;
}


class WForm {
    x;
    y;
    width;
    height;
    id = btoa(Math.random().toString() + Math.random().toString() + Math.random().toString() + Math.random().toString());
    caption;
    elements = [];
    CONTROLS = [];
    init = function () {
        var r = new WRect();
        r.x = 0;
        r.y = 0;
        r.width = this.width;
        r.height = 30;
        r.parent = this;
        r.color = { r: 100, g: 100, b: 100 };
        this.CONTROLS.push(r);
        this.elements.push(r);

        var l = new WLabel();
        l.x = 5;
        l.y = -10;
        l.text = this.caption;
        this.CONTROLS.push(l);
        this.elements.push(l);

        var close = new WButton();
        close.x = this.width - 33;
        close.y = 2;
        close.autosize = false;
        close.width = 30;
        close.height = 25;
        close.text = "X";
        close.onclick = () => {
            //alert('close');
            this.close();
        };

        this.CONTROLS.push(close);
        this.elements.push(close);

        this.elements.forEach((el) => { el.parent = this; if (!this.CONTROLS.includes(el)) el.y += 30; el.init(); });
    };
    loop = function () {
        strokeWeight(3);
        stroke(255);
        fill(60);
        rect(this.x, this.y, this.width, this.height);

        this.elements.forEach((el) => { el.parent = this; el.loop(); });
    };
    rm = function () {
        this.elements.forEach((el) => { if (el.element) el.rm(); });
        this.elements = [];
        forms = forms.filter((f) => f.id != this.id);
    };
    close = function () {
        this.rm();
    };
}

class WElement {
    constructor(x, y, width, height) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    };
    x;
    y;
    width;
    height;
    parent;
    text;
    id = btoa(Math.random().toString() + Math.random().toString() + Math.random().toString() + Math.random().toString());
    options;
    element;
    _mouseDown;
    _mouseUp;
    id = btoa(Math.random().toString() + Math.random().toString() + Math.random().toString() + Math.random().toString());
    init = function () { };
    loop = function () { if (this.element) this.element.position(this.x + this.parent.x, this.y + this.parent.y); };
    rm = function () { if (this.element) this.element.remove(); this.parent.elements = this.parent.elements.filter((el) => el.id != this.id); };
}

class WLabel extends WElement {
    constructor(x, y, text) {
        super(x, y, undefined, undefined);
        this.text = text;
    };
    fontSize;
    fontColor;
    element;
    init = function () {

        let p = createP(this.text);
        if (this.fontSize) p.style('font-size', this.fontSize);
        if (this.width && this.height) p.size(this.width, this.height);
        p.position(this.x + this.parent.x, this.y + this.parent.y);
        this.element = p;
    };
}

class WButton extends WElement {
    constructor(x, y, width, height, text, onclick) {
        super(x, y, width, height);
        this.text = text;
        this.onclick = onclick;
    };
    onclick;
    autosize = true;
    init = function () {
        let b = createButton(this.text);
        if (this.autosize == false) b.size(this.width, this.height);
        b.mousePressed(this.onclick);
        this.element = b;
    };
}

class WText extends WElement {
    constructor(x, y, width, height, autosize, text, onenter) {
        super(x, y, width, height);
        this.onenter = onenter;
        this.autosize = autosize;
        this.text = text;
    };
    autosize;
    onenter;
    value = function () {
        return this.element.value();
    }
    init = function () {
        let i = createInput(this.text, 'text');
        if (!this.autosize) i.size(this.width, this.height);
        i.elt.addEventListener('keyup', (ev) => {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                this.onenter();
            }
        });
        this.element = i;
    };
}

class WTextArea extends WElement {
    constructor(x, y, width, height, text, readonly) {
        super(x, y, width, height);
        this.text = text;
        this.readonly = readonly;
    };
    autosize;
    readonly;
    value = function () {
        return this.element.elt.value;
    }
    init = function () {
        let i = createElement('textarea', this.text);
        i.position(this.x, this.y);
        i.style('resize', 'none');
        if (this.readonly) i.elt.setAttribute('readonly', true);
        i.size(this.width, this.height);
        this.element = i;
    };
}

class WIFrame extends WElement {
    constructor(x, y, width, height, src) {
        super(x, y, width, height);
        this.src = src;
    };
    src;
    init = function () {
        let i = createElement('iframe');
        i.position(this.x, this.y);
        i.size(this.width, this.height);
        i.elt.src = this.src;
        this.element = i;
    };
}

class WImage extends WElement {
    constructor(x, y, width, height, src) {
        super(x, y, width, height);
        this.src = src;
    };
    src;
    img;
    init = function () {
        loadImage(src, (img) => {
            this.img = img;
        });
    };
    loop = function () {
        if (this.img) {
            image(this.img, this.parent.x + this.x, this.parent.y + this.y, this.width, this.height);
        }
    };
}

class WPassword extends WElement {
    constructor(x, y, width, height, autosize, text) {
        super(x, y, width, height);
        this.autosize = autosize;
        this.text = text;
    };
    autosize;
    value = function () {
        return this.element.value();
    }
    init = function () {
        let i = createInput(this.text, 'password');
        if (!this.autosize) i.size(this.width, this.height);
        this.element = i;
    };
}

class WCheckbox extends WElement {
    constructor(x, y, text) {
        super(x, y, null, null);
        this.text = text;
    };
    autosize;
    element2;
    value = function () {
        return document.getElementById(this.id).checked;
    }
    init = function () {
        let i = createInput('', 'checkbox');
        i.id(this.id);
        this.element = i;
        let l = createP(this.text);
        this.element2 = l;

    };
    loop = function () {
        if (this.element) this.element.position(this.x + this.parent.x, this.y + this.parent.y);
        if (this.element2) this.element2.position(this.x + this.parent.x + 25, this.y + this.parent.y - 15);
    };
    rm = function () {
        console.log('override!!');
        if (this.element) this.element.remove();
        if (this.element2) this.element2.remove();
        this.parent.elements = this.parent.elements.filter((el) => el.id != this.id);
    };
}

class WRect extends WElement {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
    };
    color;
    loop = function () {
        strokeWeight(3);
        stroke(255);
        fill(this.color.r, this.color.g, this.color.b);
        rect(this.x + this.parent.x, this.y + this.parent.y, this.width, this.height);
    };
}

class WLine extends WElement {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
    };
    color;
    loop = function () {
        noStroke();
        fill(this.color.r, this.color.g, this.color.b);
        line(this.x + this.parent.x, this.y + this.parent.y, this.x + this.parent.x + this.width, this.y + this.parent.y + this.height);
    };
}

var forms = [];

let logoX = 0;
let logoY = 0;
let logoVX = 2;
let logoVY = 2;

function exf(i) {
    let f = new WForm();
    f.x = 10;
    f.y = 10 + (40 * i);
    f.width = 400;
    f.caption = '<font color="white">Webforms Indev 0.1</font>';
    f.height = 300;
    let l = new WLabel();
    l.x = 10;
    l.y = 30;
    l.text = "<font color=\"white\">РЎР‘Р•Р РњР•Р“Рђ РњРђР РљР•Рў!!!!!!!!! РљРЈРџР РЈРўР®Р“ РљРЈРџР<br>РЎРњРђР РўР¤РћРќ</font>";
    f.elements.push(l);
    let b = new WButton();
    b.x = 10;
    b.y = 100;
    b.autosize = true;
    b.text = "click me";
    let c = new WCheckbox();
    c.y = 200;
    c.x = 3;
    c.text = '<font color="white">Checkbox</font>';

    let t = new WText();
    t.x = 10;
    t.y = 170;


    f.elements.push(t);

    b.onclick = function () {
        msgbox('info'.fontcolor('white'), ('checkbox is ' + (c.value() ? 'checked' : 'unchecked') + '<br>you wrote > ' + t.value()).fontcolor('white'));
    };
    f.elements.push(b);
    f.elements.push(c);
    f.init();
    forms.push(f);
}

function msgbox(title, text, cb) {
    let f = new WForm();
    f.caption = title;
    f.width = 400;
    f.height = 150;
    f.x = windowWidth / 2 - (f.width / 2);
    f.y = windowHeight / 2 - (f.height / 2);
    let b = new WButton();
    b.x = 330;
    b.y = 70;
    b.autosize = true;
    b.text = "Close";
    b.onclick = () => {
        if (cb) cb();
        f.close();
    };
    f.elements.push(b);
    let l = new WLabel();
    l.x = 10;
    l.y = 0;
    l.text = text;
    f.elements.push(l);
    f.init();
    forms.push(f);
}

function tb() {
    let f = new WForm();
    f.caption = "WForm";
    f.width = 400;
    f.height = 150;
    f.x = windowWidth / 2 - (f.width / 2);
    f.y = windowHeight / 2 - (f.height / 2);
    let t = new WTextArea();
    t.x = 0;
    t.y = 0;
    t.width = 300;
    t.height = 100;
    f.elements.push(t);
    forms.push(f);
    f.init();
}

function ifr() {
    let f = new WForm();
    f.caption = "WForm";
    f.width = 400;
    f.height = 300;
    f.x = windowWidth / 2 - (f.width / 2);
    f.y = windowHeight / 2 - (f.height / 2);
    let t = new WIFrame(0, 0, 400, 300, "chrome://dino/");
    f.elements.push(t);
    forms.push(f);
    f.init();
}

function question(title, text, cb) {
    let f = new WForm();
    f.caption = title;
    f.width = 400;
    f.height = 150;
    f.x = windowWidth / 2 - (f.width / 2);
    f.y = windowHeight / 2 - (f.height / 2);
    let b = new WButton();
    b.x = 330;
    b.y = 70;
    b.autosize = true;
    b.text = "Cancel";
    b.onclick = () => {
        if (cb) cb(false);
        f.close();
    };
    let a = new WButton();
    a.x = 260;
    a.y = 70;
    a.autosize = true;
    a.text = "Confirm";
    a.onclick = () => {
        if (cb) cb(true);
        f.close();
    };
    f.elements.push(b);
    let l = new WLabel();
    l.x = 10;
    l.y = 0;
    l.text = text;
    f.elements.push(l);
    f.elements.push(a);
    f.init();
    forms.push(f);
}

let bouncingLogoEnabled = true;

$appendFunc('draw', () => {
    if (!_$$_setupEngine) return;
    if (movingForm && draggedAt) {
        //let x = mouseX - draggedAt.x;
        //let y = mouseY - draggedAt.y;
        //noFill();
        //strokeWeight(1);
        //stroke(0, 0, 255);
        //rect(x, y, movingForm.width, movingForm.height);
        let nx = mouseX - draggedAt.x;
        let ny = mouseY - draggedAt.y;
        if (nx < 0) nx = 1;
        if (nx + movingForm.width > windowWidth) nx = windowWidth - 1 - movingForm.width;
        if (ny < 0) ny = 1;
        if (ny + movingForm.height > windowHeight) ny = windowHeight - 1 - movingForm.height;
        movingForm.x = nx;
        movingForm.y = ny;
    }
    forms.forEach((x) => {
        x.loop();
    });
}, '');

let draggedAt;
let movingForm;
let touchedAt;
$appendFunc('setupEngine', () => {
    eventHandlers.mousePressed.push(function (mouseX, mouseY) {
        let f;
        for (let i = 0; i < forms.length; i++) {
            let element = forms[i];
            if (isMouseIn(element.CONTROLS[0])) {
                f = element;
                break;
            }
        }
        touchedAt = { x: mouseX, y: mouseY };
        if (!f) return;
        movingForm = f;
        draggedAt = { x: mouseX - f.x, y: mouseY - f.y };
    });

    eventHandlers.mouseReleased.push(function () {
        if (movingForm) {
            let nx = mouseX - draggedAt.x;
            let ny = mouseY - draggedAt.y;
            if (nx < 0) nx = 1;
            if (nx + movingForm.width > windowWidth) nx = windowWidth - 1 - movingForm.width;
            if (ny < 0) ny = 1;
            if (ny + movingForm.height > windowHeight) ny = windowHeight - 1 - movingForm.height;
            movingForm.x = nx;
            movingForm.y = ny;
            movingForm = null;
        }
        touchedAt = null;
        draggedAt = null;
    });
}, '');