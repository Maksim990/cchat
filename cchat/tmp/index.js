var python;
if (photonUsePython) python = require('pythonia').python;
const url = require('url');
const fs = require('fs');

const define = async(req, res, postData, ctx) => {
    const urlParsed = url.parse(req.url, true);
    let path = urlParsed.pathname;
    if(path.endsWith('favicon.ico'))return;
    prePath = __dirname;
// До этого мы уже получили path и prePath. Теперь осталось понять, какие запросы
// мы получаем. Отсеиваем все запросы по точке, так чтобы туда попали только запросы к
// файлам, например: style.css, test.js, song.mp3
try {
var b = false;
//fs.accessSync(path, fs.constants.R_OK, (err) => {
    
//});
//if(b == true)return;
if(/\.([a-zA-Z0-9]*)$/.test(path) && !path.startsWith('/api')) {
	console.log(`load ${path}`);
      //      else{
        // А вот если у нас не иконка, то нам нужно понять, что это за файл, и сделать нужную
        // запись в res.head, чтобы браузер понял, что он получил именно то, что и ожидал.
        // На данный момент мне нужны css, js и mp3 от сервера, так что я заполнил только
        // эти случаи, но, на самом деле, стоит написать отдельный модуль для этого.
       if(/\.mp3$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'audio/mpeg'
          });
        }
        else if(/\.css$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'text/css'
          });
        }
        else if(/\.js$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'text/javascript'
          });
        }
        else if(/\.ttf$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'font/ttf'
          });
        }
        else if(/\.txt$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });
        }
        else if(/\.mp4$/gi.test(path)) {
          res.writeHead(200, {
            'Content-Type': 'video/mp4'
          });
        }
	
        // Опять же-таки, отдаём потом серверу и пишем return, чтобы он не шёл дальше.
        let readStream = fs.createReadStream("./routing/static" + path).on('error', () => {
		fs.readFileSync("./routing/error/nopage.html", "utf-8", (err, html) => {
		    res.writeHead(404, {"Content-Type": "text/html"});
		    res.end(html);
		    b = true;
		});
		});
	
	if(b==true)return;
        readStream.pipe(res);
        return;
      
    }
}catch(err) {
res.end("An unexpected error happened\n\n" + err.stack);
return;
}
if(b == true) return;
path = path.replace('..', '');
    try {
        if (path.includes('__')) return;
	let dynPath = './dynamic/' + path;
        if (dynPath.endsWith('.js')) {
            let routeDestination = require(dynPath);
            await routeDestination.define(req, res, postData, ctx);
        } else if (dynPath.endsWith('.py') && photonUsePython) {
            python(dynPath).then((x) => {
                x.requested(req, res, postData, ctx);
            });
            
        } else {
            throw new TypeError('test');
        }
	
      
    } catch(err) {
		//console.log(`cant load dyn ${path} because of ${err}`);
		//console.log(err.stack);
	      // Находим наш путь к статическому файлу и пытаемся его прочитать.
      // Если вы не знаете, что это за '=>', тогда прочитайте про стрелочные функции в es6,
      // очень крутая штука.
    let pathA = path.split('/');
    let ppath = pathA.slice(1).join('/');
     let filePath = prePath+'/static'+ppath+'/index.html';
      fs.readFile(filePath, 'utf-8', (err, html) => {
        // Если не находим файл, пытаемся загрузить нашу страницу 404 и отдать её.
        // Если находим — отдаём, народ ликует и устраивает пир во имя царя-батюшки.
        if(err) {
          let nopath = './routing/error/nopage.html';
          fs.readFile(nopath, (err , html) => {
            if(!err) {
              res.writeHead(404, {'Content-Type': 'text/html'});
              res.end(html);
            }
            // На всякий случай напишем что-то в этом духе, мало ли, иногда можно случайно
            // удалить что-нибудь и не заметить, но пользователи обязательно заметят.
            else{
              let text = "Something went wrong. Please contact gdinislam914@protonmail.ch";
              res.writeHead(404, {'Content-Type': 'text/plain'});
              res.end(text);
            }
          });
        }
        else{
          // Нашли файл, отдали, страница загружается.
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);
        }
      });    }
};

exports.define = define;