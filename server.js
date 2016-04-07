var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname;

  function error404() {
    response.writeHead(404);
    response.write("404 page not found.");
    response.end();
  }

  switch(path){
    case '/':
      fs.readFile(__dirname + path + "client/index.html", function(error, data) {
        if (error)
          error404();
        else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
          response.end();
        }
      });
      break;
    default:
        error404();
      break;
  }
});

server.listen(1337);