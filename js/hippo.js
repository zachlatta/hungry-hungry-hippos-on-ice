var Hippo = function (x, y) {
  var texture = PIXI.Texture.fromImage('/img/hippo.png');
  PIXI.Sprite.call(this, texture);

  this.anchor.x = 0.5;
  this.anchor.y = 0.5;

  this.shape = new p2.Rectangle(64,64);
  this.body = new p2.Body({
    mass:1,
    position:[x|0,y|0],
    angularVelocity:0
  });
  this.body.addShape(this.shape);
};

Hippo.prototype = Object.create(PIXI.Sprite.prototype);

Hippo.SPEED = 0.3;
Hippo.TURN_SPEED = 2;

Hippo.prototype.update = function (dt) {
  // update pixi sprite positions to physics body's position
  this.x = this.body.position[0];
  this.y = this.body.position[1];
  this.rotation = this.body.angle;
};

Hippo.prototype.moveUp = function (dt) {
  var magnitude = 2;
  var angle = this.body.angle + Math.PI / 2;
  this.body.velocity[0] -= magnitude*Math.cos(angle);
  this.body.velocity[1] -= magnitude*Math.sin(angle);
};

Hippo.prototype.turnLeft = function (dt) {
  this.body.angularVelocity = -Hippo.TURN_SPEED;
};

Hippo.prototype.turnRight = function (dt) {
  this.body.angularVelocity = Hippo.TURN_SPEED;
};

Hippo.prototype.clearTurn = function (dt) {
  this.body.angularVelocity = 0;
}

var OpponentHippo = function () {
  Hippo.call(this);
}

OpponentHippo.prototype = Object.create(Hippo.prototype);

var PlayerHippo = function (x, y) {
  Hippo.call(this, x, y);
}

PlayerHippo.prototype = Object.create(Hippo.prototype);

PlayerHippo.prototype.update = function (dt) {
  Hippo.prototype.update.call(this, dt);

  if (Key.isDown(Key.UP) || Key.isDown(Key.W)) this.moveUp(dt);

  if (Key.isDown(Key.LEFT) || Key.isDown(Key.A))       this.turnLeft(dt);
  else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) this.turnRight(dt);
  else                                                 this.clearTurn(dt);

  socket.emit('player_move', {
    position: this.body.position,
    velocity: this.body.velocity,
    angle: this.body.angle,
    angularVelocity: this.body.angularVelocity
  });
};

var Background = function (stage, world) {
  this.hippo = new PlayerHippo(100, 100);
  this.opponents = {};

  stage.addChild(this.hippo);
  world.addBody(this.hippo.body);

  var that = this;
  socket.on('player_joined', function (data) {
    console.log('player joined');
    var opponent = new OpponentHippo();

    stage.addChild(opponent);
    world.addBody(opponent.body);
    that.opponents[data.id] = opponent;
  });

  socket.on('player_left', function (data) {
    console.log('player left');
    stage.removeChild(that.opponents[data.id]);
    delete that.opponents[data.id];
  });

  socket.on('player_moved', function (data) {
    that.opponents[data.id].body.position = data.position;
    that.opponents[data.id].body.velocity = data.velocity;
    that.opponents[data.id].body.angle = data.angle;
    that.opponents[data.id].body.angularVelocity = data.angularVelocity;
  });
};

Background.prototype.update = function (dt) {
  this.hippo.update(dt);
  for (id in this.opponents) {
    this.opponents[id].update(dt);
  }
};
