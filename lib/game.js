(function () {
var DIM = [800,600];
var game = new Phaser.Game(DIM[0], DIM[1], Phaser.AUTO, '', { preload: preload, create: create, update: update});
var s;
var speed = 4;
var slope = .01;
var direction = 'left';

function preload() {
    game.load.image('background', 'lib/assets/sprites/background.png');
    game.load.spritesheet('dude', 'lib/assets/sprites/dude.png', 32, 48);
}

function create() {

    background = game.add.sprite(game.world.centerX, game.world.centerY, 'background')
    s = game.add.sprite(game.world.centerX, game.world.centerY, 'dude');

    background.anchor.setTo(.5,.5);
    background.scale.setTo(2,2);

    s.anchor.setTo(0.5, 0.1);
    s.scale.setTo(2, 2);

    s.animations.add('left', [0, 1, 2, 3], 10, false);
    s.animations.add('right',[5, 6, 7, 8], 10, false);

}

function update() {

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        s.x -= speed;
        direction = 'left';
        s.animations.play(direction);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        s.x += speed;
        direction = 'right';
        s.animations.play(direction);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        if( s.y > DIM[1]/2  ){
          s.y -= speed * .75;
          s.scale.setTo(s.scale.x - slope, s.scale.y - slope);
        }
        s.animations.play(direction);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        if( s.y < DIM[1]-150){
          s.y += speed * .75;
          s.scale.setTo(s.scale.x + slope, s.scale.y + slope);
        }
        s.animations.play(direction);
    }

}

})()
