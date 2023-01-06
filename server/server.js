process.on("uncaughtException", err => {
    console.log(`[FatalErrorNoExit]\n${err.stack}`);
});
process.on('unhandledRejection', err => {
    console.log(`[ErrorPromise]: ${err.stack}`);
});

const conf = require("./config.json");

const WebSocket = require("ws");
const server = new WebSocket.Server(conf);

let versions = ["0.0.4"];
let users = {};
let conn = {};
let verification = true;

console.log(`Server is started on ws://${conf.hostname}:${conf.port}`);
server.on("connection", (ws, req) => {
	const pnp = {ip: req.connection.remoteAddress.replace("::ffff:",""), port: req.connection.remotePort};
	const ip = `${pnp.ip}:${pnp.port}`;

    let user = {
		socket: ws,
		data: {
            ip: ip,
			version: null,
			id: 0 + Object.keys(users).length
		}
	};

    function send(ou) {
		if(typeof ou == "object") {
				ou = JSON.stringify(ou);
		} else if(typeof ou !== "string") {
			ou = String(ou);
		}

		return ws.send(ou);
	};

    //проверка на подключение с одного айпи
    if(!!conn[ip.split(":")[0]]) {
        if(ip.split(":")[0] !== conf.adminIP) {
            send({err:"Вы уже подключились к чату"});
            console.log(ip.split(":")[0] + " Вы уже подключены к чату!");
            ws.close();
        };
    };

	console.log(`Подключен ${pnp.ip}:${pnp.port}`);
    conn[ip.split(":")[0]] = {ip:ip};
	users[ip] = user;

	setInterval(() => {
		for(const key of Object.keys(users)) {
			users[key].socket.send(JSON.stringify({users:0+Object.keys(users).length,err:null}));
		}
	},5000);

    ws.on("message", (msg) => {
		msg = msg.toString();

		try {
			msg = JSON.parse(msg);
		} catch(err) {return};

		//верификация версии клиент чата
		if(!!msg.version) {
			for(let key = 0; key < versions.length; key++) {
				if(!msg.version.includes(versions[key])) continue;
				users[ip].data.version = msg.version;
			}
			if(msg.version <= versions[versions.length-1]) {
				if(msg.version !== versions[versions.length-1]) {
					send({err:"Вышло обновление чата CChat " + versions[versions.length-1]});
				};
			};
		};

		if(!users[ip].data.version) {
			console.log(`${ip} Версия этого клиента не поддерживается сервером`);
			send({err:"Ваша версия не поддерживается сервером"});
			users[ip].socket.close();
		} else {
			//Проверка имени
			if(!!msg.version) return;
			if(!msg.name) {
				send({err:"Придумайте имя прежде чем общаться"});
			} else {
				if(!!msg.message) {
                    let id = users[ip].data.id;
                    if(users[ip].data.name !== msg.name.trim()) {
                        for(const key of Object.keys(users)) {
                            if(!users[key].data.name) continue;
                            if(users[key].data.name == msg.name) {
                                if(users[key].data.ip !== ip) {
                                    return send({err:"Такое имя уже существует, выберите другое"});
                                };
                            };
                        }
                        users[ip].data.name = msg.name.split("\n").join("");
                    };
                    //отправка сообщения
                    const seuser = (ou) => {
                        for(const key of Object.keys(users)) {
                            users[key].socket.send(JSON.stringify({message:ou,nick:users[ip].data.name + `(id: ${id+1})`}));
                        };
                    }
                    const _seuser = (ou) => {
                        for(const key of Object.keys(users)) {
                            users[key].socket.send(JSON.stringify({message:ou,nick:"[system]"}));
                        };
                    }

                    //системный бот
                    let args = msg.message.split(/ +/g);
                    const cmd = args.shift().toLowerCase();
                    let _id = ip.split(":")[0];
                    let out = null;

                    function parser(out) {
                        if(typeof out == "object") out = JSON.stringify(out);
                        if(typeof out == "boolean" || typeof out == "number") out = String(out);
                        return out;
                    }

                    if(cmd.startsWith("/test")) {
                        out = parser(args);
                    };
                    if(cmd.startsWith("/help")) {
                        out = "Вас приветствует системный бот сокет-сервера!";
                    };
                    if(cmd.startsWith("/eval")) {
                        if(_id !== conf.adminIP) return _seuser("Ошибка! Эта команда доступна только хост-серверу");
                        if(!args[0]) return _seuser("Ошибка! Укажите код для выполнения");

                        try {
                            const evaled = eval(`(async () => {\n${args.join(" ")}\n})();`);
                            if(typeof evaled !== "string") {
                                const text = require("util").inspect(evaled);
                                out = text;
                            };
                        } catch(err) {
                            out = err.stack;
                        }
                    };

                    if(!out) {
                        console.log(`${msg.name}(id: ${id+1}): ${msg.message}`);
                        seuser(msg.message);
                        sd = false;
                    } else {
                        console.log(`${msg.name}(id: ${id+1}): Использовал команду ${msg.message.split(" ")[0]}`);
                        seuser(`Использовал команду ${msg.message.split(" ")[0]}`);
                        _seuser(out);
                    }

                    out = null;
                };
			}
		}

		//console.log(msg);
	});
    ws.on("close", () => {
		console.log(`Отключен ${pnp.ip}:${pnp.port}`);
		delete users[ip];
        delete conn[ip.split(":")[0]];
	});
});