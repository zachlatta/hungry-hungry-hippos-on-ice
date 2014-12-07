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

Hippo.prototype.update = function (dt) {
  if (Key.isDown(Key.UP)) this.y -= Hippo.SPEED * dt;
  if (Key.isDown(Key.LEFT)) this.x -= Hippo.SPEED * dt;
  if (Key.isDown(Key.RIGHT)) this.x += Hippo.SPEED * dt;
  if (Key.isDown(Key.DOWN)) this.y += Hippo.SPEED * dt;
};

var Background = function (stage) {
  this.hippo = new Hippo();
  stage.addChild(this.hippo);
};

Background.prototype.update = function (dt) {
  this.hippo.update(dt);
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
