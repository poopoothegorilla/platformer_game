(function () {
  var Platformer = window.Platformer = (window.Platformer || {});

  var mo = Platformer.MovingObject = function (obj) {
    this.pos = obj.pos;
    this.vel = obj.vel;
    this.height = obj.height;
    this.width = obj.width;
    this.color = obj.color;
    this.game = obj.game;
  };

  mo.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
    ctx.fill();
  };

  mo.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.vel[0] *= .8;
    this.vel[1] *= .8;
  }
})()
