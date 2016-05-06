export default class Background {
  constructor(game){
    this.game = game;
  }

  preload(){

  }

  create(){
    let background = this.game.add.sprite(0, 0, 'background');
    // background.anchor.setTo(.5,.5);
    background.scale.setTo(.5,.5);
  }

  update(){

  }
}
