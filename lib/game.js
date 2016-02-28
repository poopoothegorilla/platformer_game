(function () {

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var player = null;
var badguy = null;
var background = null;
var thugs = [];
var levels = [];
var currentLevel = 0;


function preload() {
    this.game.load.image('background', 'lib/assets/sprites/scene.png');

    // this.game.load.spritesheet('player', 'lib/assets/sprites/player.png', 19, 34);

    // this.game.load.spritesheet('dude', 'lib/assets/sprites/dude.png', 32, 48);
    this.game.load.atlasJSONArray('assets', 'lib/assets/sprites/assets.png', 'lib/assets/sprites/assets.json');
    // this.game.load.image('bad_walk_01.png', 'lib/assets/sprites/bad_walk_01.png', 21, 34);
    // this.game.load.image('bad_walk_02.png', 'lib/assets/sprites/bad_walk_02.png', 21, 34);
    // this.game.load.image('bad_walk_03.png', 'lib/assets/sprites/bad_walk_03.png', 21, 34);
    // this.game.load.image('bad_walk_04.png', 'lib/assets/sprites/bad_walk_04.png', 21, 34);
}

function create() {
    this.game.world.setBounds(0,0,2000,600);
    background = new Background(game);
    background.create();
    // this.game.add.sprite(0, 0, 'background');

    dudes = game.add.group();
    player = new Player(game);
    player.create();
    // this.game.camera.follow(player.sprite);
    this.game.camera.x = player.sprite.x;
    // badguy = new Thug(game, player, enemies);
    // for (var i = 0; i < 3; i++){
    //   var thug = new Thug(game, player, dudes);
    //   thugs.push(thug)
    //   thug.create();
    // }
    // this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'bad_walk_01.png');

    // this.sprite.anchor.setTo(0.5, 0.5);
    // this.sprite.scale.setTo(2, 2);

    // this.sprite.animations.add('walk', ['bad_walk_01.png'], 12, false);

    levels =[
      // null,
      {
        level: "1",
        badguys: "3",
        xPos: 300,
        state: 0,
      },
      {
        level: "2",
        badguys: "1",
        xPos: 800,
        state: 0,
      },
      {
        level: "3",
        badguys: "5",
        xPos: 1600,
        state: 0,
      }
    ]
    // badguy.create();

}

function update() {
  // console.log()
  player.update();
  console.log(dudes.countLiving());

  switch (levels[currentLevel].state) {
    case 0:
      this.game.camera.x = player.sprite.x - this.game.width/2;

      if (levels[currentLevel].xPos <= player.sprite.x) {
        levels[currentLevel].state = 1;
      }
      break;
    case 1:
      for (var i = 0; i < levels[currentLevel].badguys; i++){
        var thug = new Thug(game, player, dudes);
        thugs.push(thug)
        thug.create();
      }
      levels[currentLevel].state = 2;
      break;
    case 2:
      thugs.forEach(function(thug) {
        thug.update();
      });

      dudes.sort('y', Phaser.Group.SORT_ASCENDING);
      if(dudes.countLiving() == 0){
        console.log("DEAD");
        currentLevel += 1
      };
      break;
    default:
      console.log("WTF?");
  }

}

})()
