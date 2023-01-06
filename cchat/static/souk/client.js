let config = {
    hostname: null,
    port: null
};

let request = new XMLHttpRequest();

request.open('GET', "config.json");
request.onloadend = () => {
    let a = JSON.parse(request.responseText);
    config.hostname = a.hostname;
    config.port = a.port;
}

request.send();

setTimeout(() => {
notice(`Соединение с сервером ws://${config.hostname}:${config.port}`,1,10);

const chat = document.getElementById("chat");
//Ввести ник
const inputName = document.getElementById("inputName");
const btnName = document.getElementById("btnName");
//Отправить сообщение
const inputChat = document.getElementById("inputChat");
//Кол-во юзеров
const _users = document.getElementById("users");

chat.innerHTML = "[SYSTEM] чат к вашим услугам ;D";
const client = new WebSocket(`ws://${config.hostname}:${config.port}`);
let socket = false;
let nick = null;
let users = 0;

function send(ou) {
	if(typeof ou == "object") {
		try {
			ou = JSON.stringify(ou);
		} catch(err) {}
	} else if(typeof ou !== "string") {
		ou = String(ou);
	}

	return client.send(ou);
};

btnName.addEventListener("click", () => {
	if(nick != inputName.value) {
		nick = inputName.value;
	};
});
document.addEventListener("keydown", (e) => {
    if(!e.shiftKey && e.key == "Enter") {
        if(e.key == "Enter") {
            if(!nick) {
                notice("Придумайте имя прежде чем общаться",4,10);
            } else {
                if(socket) {
                    chat.scrollTop = 999999999999999;
                    send({message: inputChat.value.trim(), name: nick});
                    e.preventDefault();
                    inputChat.value = "";
                } else {
                    notice("Соединение закрыто, вы не можете отправлять сообщения :<",1,10);
                }
            }
        };
    };
});

client.onopen = function() {
	notice("Соединение установлено",2,10);
	send({version: "0.0.4"});
	socket = true;
}

client.onmessage = function(msg) {
    msg = msg.data;

	try {
		msg = JSON.parse(msg);
	} catch(err) {}

	if(!!msg.err) notice(msg.err,4,10);

    if(!!msg.users) {
        users = msg.users;
        _users.innerHTML = `подключено к чату: ${users}`;
    }

	if(!!msg.message) {
        console.log("sended");
		chat.innerHTML += `\n${msg.nick}: ${msg.message}`;
	};

    console.log(msg);
};

client.onclose = function() {
	notice("Подключение закрыто",4,60);
	socket = false;
}

client.onerror = (err) => {
	console.log(err);
    if(err.target.url == `ws://${config.hostname}:${config.port}/`) {
		console.log(err.target.readyState);
        if(err.target.readyState == 3) {
            notice("Не удалось подключиться к серверу",4,60);
        };
    };
};

},1000);
/*
        // Получаем элемент чата
let chat = document.querySelector("#divMessages")
// Получаем строку ввода сообщения
let input = document.querySelector("#inputMessage")
// Получаем кнопку для ввода сообщения
let btnSubmit = document.querySelector("#btnSend")
let name = null;

let nameSend = document.querySelector("#nameSend");
let btnName = document.querySelector("#btnName");

let users = document.getElementById("users");

// Подключаем WebSocket
const webSocket = new WebSocket('ws://2.tcp.ngrok.io:16799');
 
// Получаем сообщение от сервера
webSocket.onmessage = function(e) {
    // Парсим полученные данные
    const data = JSON.parse(e.data);
    if(!data.users) users.innerHTML = "Подключено к чату: -"
        else users.innerHTML = "Подключено к чату: " + data.users;
    if(!!data.message) {
        chat.innerHTML += '<div class="msg">' + data.message + '</div>'
    };
    // Выводим в блог сообщение от сервера
};

btnName.addEventListener("click", () => {
    if(name != nameSend.value) {
        name = nameSend.value;
    };
});

// Отслеживаем нажатие мыши
btnSubmit.addEventListener("click", () => {
    // Получаем текст из формы для ввода сообщения
    message = input.value;
    // Отправка сообщения через WS
    webSocket.send(JSON.stringify({
        'name': name,
        'message': message
    }));
    // Очищаем поле для ввода текста
    input.value = '';
})
*/