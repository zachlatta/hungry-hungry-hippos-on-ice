var renderer, stage, container, graphics, zoom, world, boxShape, boxBody,
  planeBody, planeShape;

var Game = function () {
  this.world = new p2.World({
    gravity: [0,0]
  });
  this.stage = new PIXI.Stage(0x66FF99);
  this.renderer = PIXI.autoDetectRenderer(640, 480);
  document.body.appendChild(this.renderer.view);

  this.background = new Background(this.stage, this.world);

  requestAnimFrame(this.update.bind(this));
};

Game.prototype.update = function (time) {
  var dt = time - this.time | 0;
  this.time = time;

  this.world.step(1/60);

  this.background.update(dt);
  this.renderer.render(this.stage);
  requestAnimFrame(this.update.bind(this));
};
