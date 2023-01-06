process.stdin.on("data", data => s(data.toString().replaceAll("\n\r","")));
let user = {ip: "127.0.0.1"};
let network = {};
let packet = {};

function timeout() {}

function s(msg) {
    console.log("stdin: " + msg);
}