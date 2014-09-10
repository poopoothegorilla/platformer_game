(function(){
  var Platformer = window.Platformer = (window.Platformer || {})

  var view = Platformer.GameView = function(game, ctx){
    this.game = game;
    this.ctx = ctx;
  };

  view.prototype.start = function(){
    this.bindKeyHandlers();
    setInterval(function(){
      this.game.step(ctx);
    },20)
  };

  view.prototype.bindKeyHandlers = function(){
    var game = this.game;

    key('w', function(){
      game.player.power([0,-1]);
    });

    key('a', function(){
      game.plater.power([-1,0]);
    });

    key('s', function(){
      game.player.power([0,1]);
    });

    key('d', function(){
      game.player.power([1,0]);
    });

    key('e', function(){
      game.player.attack();
    });
  }

})()
