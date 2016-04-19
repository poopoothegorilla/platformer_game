export default Background {
  Background = function(game){
    this.game = game;
  }

  Background.prototype = {
    preload: function(){

    },

    create: function(){
      background = this.game.add.sprite(0, 0, 'background')
      // background.anchor.setTo(.5,.5);
      background.scale.setTo(.5,.5);
    },

    update: function(){

    }
  }
}
