var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

var players = {}; 

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

  for (id in players) {
    socket.emit('player_joined', players[id]);
  }

  players[socket.id] = {id: socket.id, x:0, y:0};

  socket.broadcast.emit('player_joined', players[socket.id]);

  socket.on('player_move', function (data) {
    players[socket.id].x = data.x
    players[socket.id].y = data.y

    socket.broadcast.emit('player_moved', players[socket.id]);
  });

  socket.on('disconnect', function () {
    delete players[socket.id];
    socket.broadcast.emit('player_left', {id:socket.id});
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
