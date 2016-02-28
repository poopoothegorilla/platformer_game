Player = function(game) {
  this.game = game;
  this.sprite = null;
  this.size = .5;
  // this.cursors = null;
  this.speed = 150;
  this.slope = .005;
  this.direction = 'left';
  this.busy = false;
};

Player.prototype = {
  preload: function() {

  },

  create: function(){
    // this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'hero_walk_01.png');
    this.sprite = this.game.add.sprite(200, this.game.world.centerY + 100, 'assets', 'Good_standing1.png');

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
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
  },

  update: function(){
      player = this.sprite

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
};
