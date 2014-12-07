var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/create_session', function (req, res) {
  res.redirect(301, '/game');
});

app.get('/game', function (req, res) {
  res.sendFile(__dirname + '/game.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
