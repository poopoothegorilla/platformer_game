(function () {
  var Platformer = window.Platformer = (window.Platformer || {});

  var player = Platformer.Player = function (pos, game) {
    Platformer.MovingObject.call(this, {
      color: "blue",
      height: "80px",
      width: "30px",
      vel: [0,0],
      pos: pos,
      game:game
    })

  };

  Platformer.Utils.inherits(Platformer.MovingObject, player);

  player.prototype.reset = function () {
    // RESETS THE PLAYER IF DEAD OR SOMETHING
  };

  player.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };


})()
