(function () {
  var Platformer = window.Platformer = (window.Platformer || {})

  var game = Platformer.Game = function(){
    this.DIM_X = 1200;
    this.DIM_Y = 800;
    this.NUM_ASTEROIDS = 14;
    this.badguys = [];
    this.addBadguy();
    this.player = new Platformer.Player([600,400],this);

  };

  // KEEPS TRACK OF ALL OBJECTS IN THE GAME
  game.prototype.allObjects = function () {
    return this.badguys.concat([this.player]);
  };

  game.prototype.addBadguy = function(){
    // CODE TO CREATE AND ADD BADGUY TO GAME
  };

  game.prototype.remove = function(obj){
    // CODE TO REMOVE OBJ FROM GAME AKA DEAD BODY
  };

  // CODE TO REDRAW THE BOARD
  game.prototype.draw = function(ctx){
    ctx.clearRect(0,0,this.DIM_X, this.DIM_Y);
    // background image support
    // ctx.drawImage(img, 0, 0, this.DIM_X, this.DIM_Y);

    this.allObjects().forEach(function (obj) {
      return obj.draw(ctx);
    });
  };

  // CODE TO MOVE EACH OBJECT
  game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (obj) {
      return obj.move();
    });
  };

  // CODE TO PERFORM EACH FRAME OF THE GAME
  game.prototype.step = function (ctx) {
    this.draw(ctx);
    this.moveObjects();
    // NEED COLLISION DETECTION CHECK
  }
  
})()
