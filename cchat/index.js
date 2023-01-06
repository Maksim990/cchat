const http = require("http");
const pat = require("path");
const url = require("url");
const fs = require("fs");

process.on("uncaughtException", err => {});
process.on('unhandledRejection', err => {});

let plain = {
    ".html": { "Content-Type": "text/html" },
    ".mp3": { "Content-Type": "audio/mpeg" },
    ".css": { "Content-Type": "text/css" },
    ".js": { "Content-Type": "text/javascript" },
    ".ttf": { "Content-Type": "font/ttf" },
    ".txt": { "Content-Type": "text/plain" },
    ".mp4": { "Content-Type": "video/mp4" },
    ".png": { "Content-Type": "image/png" },
    ".ico": { "Content-Type": "image/x-icon" },
    ".json": { "Content-Type": "text/json" }
};
let whitelist = ["/index.html","/ops.html","/favicon.ico",
                "/souk/notice.js","/souk/index.js","/souk/client.js",
                "/souk/index.css","/test.html","/hefka.html",
                "/config.json"];
let log = {err: null, path: null};
let ac = false;
let cache = {_501: null};
let path;

let _404 = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Не найдено</title>
    </head>
    <body style="background-color:rgb(50, 59, 100)">
        <center><h2 align="center"><font color="white">Ошибка 404</font></h2></center>
        <p align="center"><font color="white">Запрашиваемый ресурс не найден, возможно, он переименован или удален</font></p>
        <hr>
        <p align="center"><font color="gray">Made by kotik9821 (C) 2022</font></p>
        <p align="center"><font color="gray">Свяжитесь с веб-мастером по адресу govno0na0malse@gmail.com</font></p>
    </body>
</html>`;
let _403 = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Запрещено</title>
    </head>
    <body style="background-color:rgb(50, 59, 100)">
        <center><h2 align="center"><font color="white">Ошибка 403</font></h2></center>
        <p align="center"><font color="white">Запрашиваемый ресурс запрещён, для просмотра, или копирования</font></p>
        <hr>
        <p align="center"><font color="gray">Made by kotik9821 (C) 2022</font></p>
    </body>
</html>`;
let _500 = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Внутренняя ошибка сервера</title>
    </head>
    <body style="background-color:rgb(50, 59, 100)">
        <center><h2 align="center"><font color="white">Ошибка 500</font></h2></center>
        <p align="center"><font color="white">Произошла внутренняя ошибка сервера, этот запрос не может быть обработан</font></p>
        <hr>
        <p align="center"><font color="gray">Made by kotik9821 (C) 2022</font></p>
        <p align="center"><font color="gray">Свяжитесь с веб-мастером по адресу govno0na0malse@gmail.com</font></p>
    </body>
</html>`;
let _501 = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Не выполнено</title>
    </head>
    <body style="background-color:rgb(50, 59, 100)">
        <center><h2 align="center"><font color="white">Ошибка 501</font></h2></center>
        <p align="center"><font color="white">Этот формат ${cache._501} не поддерживается сервером</font></p>
        <hr>
        <p align="center"><font color="gray">Made by kotik9821 (C) 2022</font></p>
        <p align="center"><font color="gray">Свяжитесь с веб-мастером по адресу govno0na0malse@gmail.com</font></p>
    </body>
</html>`;

let server = new http.Server(async(req, res) => {
    function load(html,obj) {
        if(!obj) obj = {status: 200, plain: { "Content-Type": "text/html" }};
        if(!html) html = "<h1 style='color: grey;'>(unknown)</h1>";
        res.writeHead(obj.status, obj.plain);
        res.write(html);
        res.end();
    }
    try {
        path = url.parse(req.url);
        if(path.path == "/") path.path = "/index.html";
        log.path = __dirname + path.path;
        if(fs.existsSync(__dirname + "/static" + path.path)) {
            for(let key = 0; key < whitelist.length; key++) {
                if(path.path == whitelist[key]) {
                    ac = true;
                    break;
                };
            }
            if(ac) {
                let file = fs.readFileSync(__dirname + "/static" + path.path);
                if(!plain[pat.extname(path.path)]) {
                    cache._501 = path.path;
                    load(_501,{status:501,plain: { "Content-Type": "text/html" }});
                    log.path = __dirname + path.path;
                    ac = false;
                    log.err = 501;
                } else {
                    load(file,{status:200,plain: plain[pat.extname(path.path)]});
                    ac = false;
                    log.err = null;
                }
            } else {
                load(_403,{status:403,plain: { "Content-Type": "text/html" }});
                log.path = __dirname + path.path;
                log.err = 403;
            }
        } else {
            load(_404,{status:404, plain: { "Content-Type": "text/html" }});
            log.path = __dirname + path.path;
            log.err = 404;
        }

        req.on("data",data => {
            data = data.toString();
            console.log(require("util").inspect(data));
        });
        req.on("error",err=>{});
        req.on("close",()=>{});
        req.on("end",()=>{});

        console.log(`${(!log.err ? "200" : log.err)} : ${log.path}`);
    } catch(err) {
        load(_500,{status:500, plain: { "Content-Type": "text/html" }});
        console.error(err.stack);
    }
}).listen({hostname:"102.0.0.1",port:9822},()=>console.log("http://127.0.0.1:9822"));