var http = require("http");
var url = require('url');
var fs = require('fs');
var hashtag = "";


fs.readFile(__dirname  + "/server.conf", function(error, data) {
  if (error) 
    console.log("pas de fichier de configuration");
  else {
    hashtag = data.toString();
    console.log(hashtag);
  }
})

/*
 * creation du serveur
 */
var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname;

  /*
   * function d'erreur en cas de path non valide
   */
  function error404() {
    response.writeHead(404);
    response.write("404 page not found.");
    response.end();
  }


  function sendResponse(responsePath, responseType, fail) {
    if (fail) {
      error404();
      return;
    }
    fs.readFile(__dirname + responsePath, function (error, data) {
      if (error)
        error404();
      else {
        response.writeHead(200, {"Content-Type": responseType});
        response.write(data, "utf8");
        response.end();
      }
    })
  }


  if (path == '/')
    sendResponse(path + "client/index.html", "text/html", false);
  else if (path == "/client/js/socket.io.js")
    sendResponse(path, "application/javascript", false);
  else if (path == "/client/js/index.js")
    sendResponse(path, "application/javascript", false);
  else
    sendResponse("", "", true);
});


server.listen(1337);


/*
 * Partie socket/twitter du serveur
 */


var Twitter = require('node-tweet-stream')
fs.readFile(__dirname  + "/config", function(error, data) {
  if (error)
    console.log("pas de fichier de configuration");
  else {
    try {
      var t = new Twitter(JSON.parse(data.toString()))

      t.on('error', function (err) {
        console.log(err)
      })
      t.track(hashtag)

      var io = require('socket.io')(server);

      io.on('connection', function (socket) {

        t.on('tweet', function (tweet) {
          socket.emit('tweet', tweet)
        })

        //socket.on('pouet', function (data) {
          //console.log(data);
        //})
      });
    }
    catch (e)
    {
      console.log("could not connect to twitter")
    }
  }
})
