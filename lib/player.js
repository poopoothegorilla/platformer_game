import Attacks from './helpers/attack-engine.js';

export default class Player {

  constructor(game, name, enemyGroup) {
    this.game = game;
    this.enemyGroup = enemyGroup; // what this actor should be targeting
    this.name = `Player-${name}`;
    this.health = 0;
    this.sprite = null;
    this.size = .5;
    this.speed = 150;
    this.slope = .005;
    this.direction = 'left';
    this.busy = false;
    this.text = null;
    this.keybindings = null;
    this.attacks = null;
  }

  preload() {

  }

  addSpriteEvents() {
    // http://phaser.io/docs/2.4.6/Phaser.Signal.html
    this.sprite.events.isHit = new Phaser.Signal()
    this.sprite.events.isHit.add(() => {
      this.injured();
    });
  }

  addPlayerAttacks() {
    const { sprite, game, enemyGroup } = this;
    // create a group for all the player's attackboxes
    // new Group(game, parent, name, addToStage, enableBody, physicsBodyType)
    this.attacks = new Attacks(sprite, enemyGroup);
    const xPosRight = (sprite.width/2) * this.size;
    const xPosLeft = (sprite.width/2) / this.size;
    const yPos = -(sprite.height/2);

    this.attacks.create({
      name: 'punch',
      width: 30,
      height: 30,
      xPosRight: xPosRight,
      xPosLeft: xPosLeft,
      yPos: yPos,
      damageValue: 5
    })
  }

  punch() {
    this.busy = true;
    this.sprite.animations.play('punch');
    this.attacks.activate('punch');
    this.busy = false;
  }

  create(){
    const { game } = this;
    // this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'hero_walk_01.png');
    this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'Good_standing1.png');

    this.game.physics.enable(this.sprite);

    this.health = 100;

    this.sprite.name = this.name;
    this.sprite.health = this.health;

    this.sprite.direction = 'right'; // default direction to right

    this.addSpriteEvents();
    this.addPlayerAttacks();

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.scale.setTo(this.size, this.size);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.syncBounds = true; // stops hitbox (body) from expanding when punching

    this.sprite.animations.add('punch', ['Good_punchingRight.png', 'Good_punchingRight.png'], 12, false);
    this.sprite.animations.add('walk',['Good_walkingRight1.png','Good_walkingRight2.png'], 12, false);
    this.sprite.animations.add('idle',['Good_standing1.png', 'Good_standing2.png'], 3, false);
    this.sprite.animations.add('injured',['Good_punchedLeft.png'], 12, false);
    this.sprite.events.onAnimationComplete.add(function(){
      this.busy = false;
      this.sprite.animations.play('idle');
    }.bind(this));

    // Create keybindings
    // TODO: this can be dynamic when multiple players are created; pass in an obj of input keys instead.
    this.keybindings = this.game.input.keyboard.addKeys(
      { 'up': Phaser.KeyCode.UP,
        'down': Phaser.KeyCode.DOWN,
        'left': Phaser.KeyCode.LEFT,
        'right': Phaser.KeyCode.RIGHT,
        'punch': Phaser.KeyCode.SPACEBAR
      }
    );
    this.keybindings.up.onHoldContext = this;
    this.keybindings.down.onHoldContext = this;
    this.keybindings.left.onHoldContext = this;
    this.keybindings.right.onHoldContext = this;

    this.keybindings.up.onHoldCallback = this.moveUp;
    this.keybindings.down.onHoldCallback = this.moveDown;
    this.keybindings.left.onHoldCallback = this.moveLeft;
    this.keybindings.right.onHoldCallback = this.moveRight;

    this.keybindings.punch.onDown.add(this.punch, this, 1);
  }

  moveUp() {
    const { game, sprite } = this;
    if( sprite.y > game.height/2 + 50 ){
      sprite.body.velocity.y = -this.speed * .75;
      // player.scale.setTo(player.scale.x - this.slope, player.scale.y - this.slope);
    }
    this.busy = true;
    sprite.animations.play('walk');
  }

  moveDown() {
    const { game, sprite } = this;
    if( sprite.y < game.height-100){
      sprite.body.velocity.y = this.speed * .75;
      // player.scale.setTo(player.scale.x + this.slope, player.scale.y + this.slope);
    }
    this.busy = true;
    sprite.animations.play('walk');
  }

  moveLeft() {
    const { game, sprite } = this;
    sprite.scale.x = -this.size;
    sprite.direction = 'left';
    if( sprite.x > this.game.camera.x + 25){
      sprite.body.velocity.x = -this.speed; // make sprite move
    }
    this.busy = true;
    sprite.animations.play('walk');
  }

  moveRight() {
    const { game, sprite } = this;
    sprite.scale.x = this.size;
    if( sprite.x < game.camera.x + game.camera.width - 25){
      sprite.body.velocity.x = this.speed; // Make sprite move
    }
    this.busy = true;
    sprite.animations.play('walk');
  }

  update(){
      const player = this.sprite

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      // TODO: implement block?
      // if (this.game.input.keyboard.isDown(Phaser.Keyboard.ZERO) && this.busy == false)
      // {
      //     this.busy = true;
      //     player.animations.play('injured');
      //
      // }
  }

  injured(){
    this.busy = true;
    this.sprite.busy = true;
    this.state = 'injured';
    // this.sprite.body.velocity.x = 0;
    // this.sprite.body.velocity.y = 0;
    this.sprite.health -= 5;
    this.game.healthbars.updateHealthBar(this.name, this.sprite.health);
    this.lastDazedTime = new Date().getTime();
    this.busy = false;
    this.sprite.busy = false;
    this.sprite.animations.play('injured');
    if(this.sprite.health <= 0) {
      setTimeout(function(){
        this.dead();
      }.bind(this), 200);
    }
  }

  dead(){
    this.state = 'dead';
    this.busy = true;
    this.sprite.animations.play('death');
    setTimeout(function(){
      this.flash();
    }.bind(this), 1000)
    setTimeout(function(){
      this.flash();
    }.bind(this), 1500)
    setTimeout(function(){
      this.flash();
    }.bind(this), 1800)
    setTimeout(function(){
      this.flash();
    }.bind(this), 1900)
    setTimeout(function(){
      this.sprite.kill();
    }.bind(this), 2000);
    // TODO: Destroy key events
  }

  flash(){
    this.sprite.alpha = 0;
    setTimeout(function(){
      this.sprite.alpha = 1;
    }.bind(this), 100)
  }
};
