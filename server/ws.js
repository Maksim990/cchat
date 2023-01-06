const { WebSocket } = require("ws");
const ws = new WebSocket("ws://54.208.23.219:25002");

ws.onopen = function() {
    console.log("Подключение с сервером установлено");
}

ws.onmessage = function(e) {
    console.log("server: " + e.data);
};

ws.onclose = function() {
    console.log("Соединение закрыто");
};

ws.onerror = function(e) {
    console.log("Не удалось подключиться к серверу");
}

process.stdin.on("data", (data) => {
    ws.send(data);
});

process.once('SIGINT', () => console.log('SIGINT'));
//process.once('SIGTERM', () => console.log('SIGTERM'));

/*const clien = new WebSocket("ws://0.tcp.eu.ngrok.io:15256");

clien.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(message);
    });
});*/