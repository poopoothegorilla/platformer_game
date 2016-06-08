import HitDetection from './helpers/hit-detection.js';

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
    this.playerAttackboxes = null;
    this.hitDetection = null;
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

  addPlayerAttacks() {
    const { sprite, game } = this;

    // create a group for all the player's attackboxes
    this.playerAttackboxes = new Phaser.Group(game, sprite, "PlayerAttackboxes", null, true);
    let playerAttackboxes = this.playerAttackboxes;
    playerAttackboxes.height = sprite.height;

    // create an attack box (really just an empty sprite with a physics body)
    // create(x, y)
    // The x/y coordinates to display the newly created Sprite at. The value is in relation to the group.x/y point.
    let attackboxPunch = playerAttackboxes.create(0,0, null);
    attackboxPunch.name = "punch";
    attackboxPunch.body.setSize(30, 30);
    attackboxPunch.xPosRight = (sprite.width/2 * this.size); // store on the sprite the desired position of box when player is facing right or left, for retrieval in the activate function
    attackboxPunch.xPosLeft = ((sprite.width/2) / this.size);
    attackboxPunch.x = attackboxPunch.xPosRight;// default to right-facing position
    attackboxPunch.y = -(sprite.height/2)
  }

  //* Helper
  activateAttackbox(name, group) {
    const { game, sprite } = this;

    // search all the attackboxes
    group.children.forEach((attackboxSprite) => {
      // if we find the attackbox with the "name" specified
      if (attackboxSprite.name === name) {
        let xPos;
        if (sprite.direction == 'right') {
          xPos = attackboxSprite.xPosRight;
          attackboxSprite.x = xPos;
        } else if (sprite.direction == 'left') {
          xPos = attackboxSprite.xPosLeft;
          attackboxSprite.x = xPos;
        }

        // Show box
        game.debug.body(attackboxSprite, "#9090ff", false)
        game.debug.spriteInfo(attackboxSprite, 32, 256);

      }
    })
  }

  // disable all active hitboxesfunction
  // Helper
  deactivateAttackbox(attackboxGroup) {
    attackboxGroup.forEachExists(function(attackbox) {
      attackbox.kill();
    });
  }

  punch() {
    console.log('firing punch')
    this.busy = true;
    this.sprite.animations.play('punch');
    this.activateAttackbox('punch', this.playerAttackboxes);
    this.hitDetection.update(); // check for hit
  }

  create(){
    const { game, enemyGroup } = this;
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

    this.sprite.direction = 'right'; // default direction to right

    this.addSpriteEvents();
    this.addPlayerAttacks();

    this.sprite.body.collideWorldBounds = true;

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.scale.setTo(this.size, this.size);

    this.sprite.animations.add('punch', ['Good_punchingRight.png', 'Good_punchingRight.png'], 12, false);
    this.sprite.animations.add('walk',['Good_walkingRight1.png','Good_walkingRight2.png'], 12, false);
    this.sprite.animations.add('idle',['Good_standing1.png', 'Good_standing2.png'], 3, false);
    this.sprite.animations.add('injured',['Good_punchedLeft.png'], 12, false);
    this.sprite.events.onAnimationComplete.add(function(){
      this.busy = false;
      this.sprite.animations.play('idle');
    }.bind(this));

    this.hitDetection = new HitDetection(game, this.playerAttackboxes, this.enemyGroup);

    // Create keybindings
    this.keybindings = this.game.input.keyboard.addKeys(
      { 'up': Phaser.KeyCode.UP,
        'down': Phaser.KeyCode.DOWN,
        'left': Phaser.KeyCode.LEFT,
        'right': Phaser.KeyCode.RIGHT,
        'punch': Phaser.KeyCode.SPACEBAR
      }
    );
    // listener, listenerContext, priority, args
    this.keybindings.punch.onDown.add(this.punch, this, 0);
  }


  update(){
      const player = this.sprite

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;


      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
      {
        player.scale.x = -this.size;
        player.direction = 'left';
        if( player.x > this.game.camera.x + 25){
          player.body.velocity.x = -this.speed;
        }
        this.busy = true;
        player.animations.play('walk');

      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
      {
          player.scale.x = this.size;
          player.direction = 'right';
          if( player.x < this.game.camera.x + this.game.camera.width - 25){
            player.body.velocity.x = this.speed;
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
    this.health -= 1;
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
    // TODO: Destroy key events
  }

  flash(){
    this.sprite.alpha = 0;
    setTimeout(function(){
      this.sprite.alpha = 1;
    }.bind(this), 100)
  }
};
