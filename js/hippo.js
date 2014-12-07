var Hippo = function (id) {
  this.id = id;

  var texture = PIXI.Texture.fromImage('/img/hippo.png');
  PIXI.Sprite.call(this, texture);
};

Hippo.prototype = Object.create(PIXI.Sprite.prototype);

Hippo.SPEED = 0.3;

Hippo.prototype.moveUp = function (dt) {
  this.y -= Hippo.SPEED * dt;
};

Hippo.prototype.moveLeft = function (dt) {
  this.x -= Hippo.SPEED * dt;
};

Hippo.prototype.moveRight = function (dt) {
  this.x += Hippo.SPEED * dt;
};

Hippo.prototype.moveDown = function (dt) {
  this.y += Hippo.SPEED * dt;
};

var OpponentHippo = function (id) {
  Hippo.call(this, id);
}

OpponentHippo.prototype = Object.create(Hippo.prototype);

OpponentHippo.prototype.update = function (dt) {
};

var PlayerHippo = function (id) {
  Hippo.call(this, id);
}

PlayerHippo.prototype = Object.create(Hippo.prototype);

PlayerHippo.prototype.moveUp = function (dt) {
  Hippo.prototype.moveUp.call(this, dt);
  socket.emit('player_move', {x:this.x, y:this.y});
};

PlayerHippo.prototype.moveLeft = function (dt) {
  Hippo.prototype.moveLeft.call(this, dt);
  socket.emit('player_move', {x:this.x, y:this.y});
};

PlayerHippo.prototype.moveRight = function (dt) {
  Hippo.prototype.moveRight.call(this, dt);
  socket.emit('player_move', {x:this.x, y:this.y});
};

PlayerHippo.prototype.moveDown = function (dt) {
  Hippo.prototype.moveDown.call(this, dt);
  socket.emit('player_move', {x:this.x, y:this.y});
};

PlayerHippo.prototype.update = function (dt) {
  if (Key.isDown(Key.UP)) this.moveUp(dt);
  if (Key.isDown(Key.LEFT)) this.moveLeft(dt);
  if (Key.isDown(Key.RIGHT)) this.moveRight(dt);
  if (Key.isDown(Key.DOWN)) this.moveDown(dt);
};

var Background = function (stage) {
  this.hippo = new PlayerHippo();
  this.opponents = {};

  stage.addChild(this.hippo);

  var that = this;
  socket.on('player_joined', function (data) {
    console.log('player joined');
    var opponent = new OpponentHippo();
    opponent.x = data.x;
    opponent.y = data.y;

    stage.addChild(opponent);
    that.opponents[data.id] = opponent;
  });

  socket.on('player_left', function (data) {
    console.log('player left');
    stage.removeChild(that.opponents[data.id]);
    delete that.opponents[data.id];
  });

  socket.on('player_moved', function (data) {
    console.log('moved', data);
    that.opponents[data.id].x = data.x;
    that.opponents[data.id].y = data.y;
  });
};

Background.prototype.update = function (dt) {
  this.hippo.update(dt);
  for (id in this.opponents) {
    this.opponents[id].update(dt);
  }
};
