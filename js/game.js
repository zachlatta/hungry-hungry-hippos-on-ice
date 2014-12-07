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
