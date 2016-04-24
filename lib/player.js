export default class Player {

  constructor(game) {
    this.game = game;
    this.name = null;
    this.health = 0;
    this.sprite = null;
    this.size = .5;
    // this.cursors = null;
    this.speed = 150;
    this.slope = .005;
    this.direction = 'left';
    this.busy = false;
  }

  preload() {

  }

  addSpriteEvents() {
    // http://phaser.io/docs/2.4.6/Phaser.Signal.html
    this.sprite.events.isHit = new Phaser.Signal()
    this.sprite.events.isHit.add(() => {
      console.log(`${this.name} is hit!`)
      this.injured();
    });
  }

  create(){
    // this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'hero_walk_01.png');
    this.name = 'PlayerOne';
    this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'Good_standing1.png');

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.health = 100;

    this.sprite.name = this.name;
    this.sprite.health = this.health;
    this.sprite.events.onKilled.add(function() {
      console.log(`${this.name} is killed!`)
    }, this);

    this.addSpriteEvents();

    this.sprite.body.collideWorldBounds = true;

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.scale.setTo(this.size, this.size);

    // this.sprite.animations.add('punch_left', [8, 9, 10, 11], 12, false);
    // this.sprite.animations.add('punch', ['hero_punch_01.png', 'hero_punch_02.png', 'hero_punch_03.png'], 12, false);
    this.sprite.animations.add('punch', ['Good_punchingRight.png', 'Good_punchingRight.png'], 12, false);
    // this.sprite.animations.add('walk',['hero_walk_01.png', 'hero_walk_02.png', 'hero_walk_03.png', 'hero_walk_04.png'], 12, false);
    this.sprite.animations.add('walk',['Good_walkingRight1.png','Good_walkingRight2.png'], 12, false);
    // this.sprite.animations.add('walk', [4, 5, 6, 7], 12, false);
    // this.sprite.animations.add('idle',['hero_walk_01.png'], 12, false);
    this.sprite.animations.add('idle',['Good_standing1.png', 'Good_standing2.png'], 3, false);
    this.sprite.animations.add('injured',['Good_punchedLeft.png'], 12, false);
    this.sprite.events.onAnimationComplete.add(function(){
      this.busy = false;
      this.sprite.animations.play('idle');
    }.bind(this));
    // this.cursors = this.game.input.keyboard.createCursorKeys();

    this.scoreText = this.game.add.text(32, 550, 'player health: ' + this.health, { font: "20px Arial", fill: "#ffffff", align: "left" });
  }

  punchHitDetection(player) {
    hitBox = {
      width: 50,
      thickness: 10
    };
  }

  update(){
      const player = this.sprite

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
      {
        player.scale.x = -this.size;
        if( player.x > this.game.camera.x + 25){
          player.body.velocity.x = -this.speed;
          // this.direction = 'left';
        }
        this.busy = true;
        player.animations.play('walk');

      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
      {
          player.scale.x = this.size;
          if( player.x < this.game.camera.x + this.game.camera.width - 25){
            player.body.velocity.x = this.speed;
            // this.direction = 'right';
          }
          this.busy = true;
          player.animations.play('walk');
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
      {
          if( player.y > this.game.height/2 + 50 ){
            player.body.velocity.y = -this.speed * .75;
            // player.scale.setTo(player.scale.x - this.slope, player.scale.y - this.slope);
          }
          this.busy = true;
          player.animations.play('walk');
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
      {
          if( player.y < this.game.height-100){
            player.body.velocity.y = this.speed * .75;
            // player.scale.setTo(player.scale.x + this.slope, player.scale.y + this.slope);
          }
          this.busy = true;
          player.animations.play('walk');
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.busy == false)
      {
          this.busy = true;
          player.animations.play('punch');

      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.ZERO) && this.busy == false)
      {
          this.busy = true;
          player.animations.play('injured');

      }
      // if (player.animations.currentAnim.name != 'punch_right' ||
      //     player.animations.currentAnim.name != 'punch_left' ||
      //     player.animations.currentAnim.name != 'left' ||
      //   player.animations.currentAnim.name != 'right')
      // {
      //     player.events.onAnimationComplete.add(function(){
      //         this.busy = false;
      //     });
      // }

  }

  injured(){
    this.busy = true;
    this.sprite.busy = true;
    this.state = 'injured';
    // this.sprite.body.velocity.x = 0;
    // this.sprite.body.velocity.y = 0;
    this.health -= 1;
    this.scoreText.text = `${this.name}'s health: ${this.health}`;
    this.lastDazedTime = new Date().getTime();
    this.busy = false;
    this.sprite.busy = false;
    this.sprite.animations.play('injured');
    if(this.health <= 0) {
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
  }

  flash(){
    this.sprite.alpha = 0;
    setTimeout(function(){
      this.sprite.alpha = 1;
    }.bind(this), 100)
  }
};
