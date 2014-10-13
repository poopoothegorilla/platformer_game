(function () {

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var s;
var speed = 4;
var slope = .01;
var direction = 'left';
var busy = false;

function preload() {
    game.load.image('background', 'lib/assets/sprites/background.png');
    game.load.spritesheet('player', 'lib/assets/sprites/player.png', 19, 34);
}

function create() {

    background = game.add.sprite(game.world.centerX, game.world.centerY, 'background')
    s = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    background.anchor.setTo(.5,.5);
    background.scale.setTo(2,2);

    s.anchor.setTo(0.5, 0.1);
    s.scale.setTo(2, 2);


    s.animations.add('right',[0, 1, 2, 3], 12, false);
    s.animations.add('left', [4, 5, 6, 7], 12, false);
    s.animations.add('punch_left', [8, 9, 10, 11], 12, false);
    s.animations.add('punch_right', [12, 13, 14, 15], 12, false);

}

function update() {

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
      if( s.x > 25){
        s.x -= speed;
        direction = 'left';
      }
      busy = true;
        s.animations.play(direction);

    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        if( s.x < game.width-25){
          s.x += speed;
          direction = 'right';
      }
      busy = true;
        s.animations.play(direction);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        if( s.y > game.height/2  ){
          s.y -= speed * .75;
          s.scale.setTo(s.scale.x - slope, s.scale.y - slope);
        }
        busy = true;
        s.animations.play(direction);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        if( s.y < game.height-150){
          s.y += speed * .75;
          s.scale.setTo(s.scale.x + slope, s.scale.y + slope);
        }
        busy = true;
        s.animations.play(direction);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
      (busy === false))
    {
        busy = true;
        s.animations.play('punch_' + direction);

    }

    if (s.animations.currentAnim.name != 'punch_right' ||
        s.animations.currentAnim.name != 'punch_left' ||
        s.animations.currentAnim.name != 'left' ||
        s.animations.currentAnim.name != 'right')
    {
        s.events.onAnimationComplete.add(function(){
            busy = false;
        });
    }


}

})()
