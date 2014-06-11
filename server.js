var http = require('http');
var send = require('send');

var app = http.createServer(function(req, res){
  console.log(req.url);
  send(req, req.url).root(__dirname).pipe(res);
}).listen(3000);