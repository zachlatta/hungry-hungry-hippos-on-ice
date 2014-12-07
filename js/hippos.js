var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);

window.addEventListener('keydown', function(event) {
  Key.onKeydown(event);
}, false);

var Hippo = function () {
  var texture = PIXI.Texture.fromImage('/img/hippo.png');
  PIXI.Sprite.call(this, texture);
};

Hippo.prototype = Object.create(PIXI.Sprite.prototype);

Hippo.SPEED = 0.3;

var OpponentHippo = function () {
  Hippo.call(this);
}

OpponentHippo.prototype = Object.create(Hippo.prototype);

OpponentHippo.prototype.update = function (dt) {
  _.random(0, 1) ?  this.x += Hippo.SPEED * dt : this.x -= Hippo.SPEED * dt;
  _.random(0, 1) ?  this.y += Hippo.SPEED * dt : this.y -= Hippo.SPEED * dt;
};

var PlayerHippo = function () {
  Hippo.call(this);
}

PlayerHippo.prototype = Object.create(Hippo.prototype);

PlayerHippo.prototype.update = function (dt) {
  if (Key.isDown(Key.UP)) this.y -= Hippo.SPEED * dt;
  if (Key.isDown(Key.LEFT)) this.x -= Hippo.SPEED * dt;
  if (Key.isDown(Key.RIGHT)) this.x += Hippo.SPEED * dt;
  if (Key.isDown(Key.DOWN)) this.y += Hippo.SPEED * dt;
};

var Background = function (stage) {
  this.hippo = new PlayerHippo();
  this.opponentHippos = _.times(3, function () {
    return new OpponentHippo();
  });

  stage.addChild(this.hippo);
  this.opponentHippos.forEach(function (h) { stage.addChild(h); });
};

Background.prototype.update = function (dt) {
  this.hippo.update(dt);
  this.opponentHippos.forEach(function (h) { h.update(dt) });
};

var Game = function () {
  this.stage = new PIXI.Stage(0x66FF99);
  this.renderer = PIXI.autoDetectRenderer(640, 480);
  document.body.appendChild(this.renderer.view);

  this.background = new Background(this.stage);

  requestAnimFrame(this.update.bind(this));
};

Game.prototype.update = function (time) {
  var dt = time - this.time | 0;
  this.time = time;

  this.background.update(dt);
  this.renderer.render(this.stage);
  requestAnimFrame(this.update.bind(this));
};

function init() {
  game = new Game();
}
