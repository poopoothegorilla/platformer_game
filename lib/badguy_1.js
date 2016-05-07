export default class Thug {

  constructor(game, player, group) {
    this.game = game;
    this.group = group;
    this.player = player;
    this.name = null;
    this.sprite = null;
    this.busy = false;
    this.health = 0;
    this.size = .5;
    this.state = 'standing'; // default state
    this.randomX = 0;
    this.randomY = 0;
    this.scoreText = null;
    this.lastDazedTime = new Date().getTime();
    this.injured = this.injured.bind(this);
  }

  preload(){

  }

  createEvents() {
  }

  updateSprite() {
    // TODO: maybe change it so any change to state has to pass through a special method that also automatically updates sprite? Kind of like React's setState? That way, we don't have to remember to also call updateSprite() whenever we change state too.
    this.sprite.name = this.name;
    this.sprite.health = this.health;
    this.sprite.state = this.state;
  }

  create(id){
    // this.sprite = this.group.create(this.game.camera.x + this.game.width, this.game.rnd.between(this.game.height/2 + 50, this.game.height-100), 'dude');
    // this.sprite = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'dude');

    // this.sprite = this.game.add.sprite(this.game.camera.x + this.game.width, this.game.rnd.between(this.game.height/2 + 50, this.game.height-100), 'assets', 'bad_walk_01.png');
    this.name = `Thug-${id}`;

    this.sprite = this.game.add.sprite(
      this.game.camera.x + this.game.width + 25,
      this.game.rnd.between(this.game.height/2 + 50,
      this.game.height-100), 'assets', 'Evil_standing1.png');

    this.group.add(this.sprite);

    this.health = 15;

    this.updateSprite();

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.scale.setTo(this.size, this.size);

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.updateState, this);
    //
    // this.sprite.animations.add('idle', ['bad_walk_01.png'], 12, false);
    // this.sprite.animations.add('walk', ['bad_walk_01.png', 'bad_walk_02.png', 'bad_walk_03.png', 'bad_walk_04.png'], 12, false);
    // this.sprite.animations.add('run', ['bad_run_01.png', 'bad_run_02.png', 'bad_run_03.png', 'bad_run_04.png'], 12, false);
    // this.sprite.animations.add('punch', ['bad_punch_01.png', 'bad_punch_02.png', 'bad_punch_03.png', 'bad_punch_04.png'], 12, false);
    // this.sprite.animations.add('injured', ['bad_hit_01.png'], 12, false);
    this.sprite.animations.add('idle', ['Evil_standing1.png','Evil_standing2.png'], 12, false);
    this.sprite.animations.add('walk', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
    this.sprite.animations.add('run', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
    this.sprite.animations.add('punch', ['Evil_punchingRight.png'], 12, false);
    this.sprite.animations.add('injured', ['Evil_punchedLeft.png'], 12, false);
    this.sprite.animations.add('death', ['Evil_deadLeft.png'], 12, false);

    // injured = this.sprite.animations.add('injured', [0, 1, 2, 3, 4, 5, 6, 7], 12, false);
    // injured.onComplete.add(fucntion(){ this.animations.play('')})

    this.scoreText = this.game.add.text(32, 550, 'enemy health: ' + this.health, { font: "20px Arial", fill: "#ffffff", align: "right" });

    this.createEvents();
  }

  update(){
    if (this.sprite.body.velocity.x != 0){
      this.sprite.body.velocity.x *= .75;
      if(this.sprite.body.velocity.x < .005 && this.sprite.body.velocity.x > -.005){
        this.sprite.body.velocity.x = 0;
      }
    }

    if (!this.dazed()) {
      if (this.player.sprite.x < this.sprite.x){
        this.sprite.scale.x = -1 * this.size;
      } else {
        this.sprite.scale.x = this.size;
      }
      this.runState();

      this.punchHitDetection(this, this.player);
      if (this.proximityDetection(this.sprite, this.player.sprite) && (this.state == 'stalking' || this.state == 'chasing')) {
        this.state = 'attacking';
        this.updateSprite();
      }
    }
  }

  punchHitDetection(badguy, player) {
    const hitBox = {
      width: 50,
      thickness: 10
    };

    const badguySprite = badguy.sprite;
    const playerSprite = player.sprite;

    const thisRight = badguySprite.x + badguySprite.width/2;
    const thisLeft = badguySprite.x - badguySprite.width/2;
    const thisFar = badguySprite.y - hitBox.thickness;
    const thisClose = badguySprite.y + hitBox.thickness;

    const playerRight = playerSprite.x + playerSprite.width/2;
    const playerLeft = playerSprite.x - playerSprite.width/2;
    const playerFar = playerSprite.y - hitBox.thickness;
    const playerClose = playerSprite.y + hitBox.thickness;

    if (playerSprite.animations.currentAnim.name === 'punch' && this.inZpace(playerClose, playerFar, badguySprite.y)) {
      if (playerSprite.scale.x > 0) {
        if ((playerRight < thisLeft) && (playerRight + hitBox.width > thisLeft)) {
          badguySprite.body.velocity.y = 0;
          badguySprite.body.velocity.x = 1000;
        }
      }
      if (playerSprite.scale.x < 0) {
        if ((playerLeft > thisRight) && (playerLeft - hitBox.width < thisRight)) {
          badguySprite.body.velocity.y = 0;
          this.ThugEvents.emit('isPunched', player.name)
          badguySprite.body.velocity.x = -1000;
        }
      }
    }
  }

  proximityDetection(badguy, player) {
    const hitBox = {
      width: 50,
      thickness: 10,
      x: 0,
      y: 0,
    };

    const thisRight = badguy.x + badguy.width/2;
    const thisLeft = badguy.x - badguy.width/2;
    const thisFar = badguy.y - hitBox.thickness;
    const thisClose = badguy.y + hitBox.thickness;

    const playerRight = player.x + player.width/2;
    const playerLeft = player.x - player.width/2;
    const playerFar = player.y - hitBox.thickness;
    const playerClose = player.y + hitBox.thickness;

    if (this.inZpace(playerClose, playerFar, badguy.y)) {
      if ((player.x < thisLeft) && (player.x > thisLeft - hitBox.width)) {
        return true;
      } else if ((player.x > thisRight) && (player.x < thisRight + hitBox.width)) {
        return true;
      }
    }
  }

  inZpace(close, far, target) {
    if (target < close && target > far) {
      return true;
    }

    return false;
  }

  updateState(){
    if (!this.dazed()) {
      let stateChoices = ['standing', 'stalking', 'chasing', 'walking'];
      this.state = stateChoices[this.game.rnd.between(0,3)];

      if(this.state == 'walking'){
        this.randomX = this.game.rnd.between(25, this.game.width-25);
        this.randomY = this.game.rnd.between((this.game.height/2 + 50), (this.game.height-100));
      }
    }
    this.updateSprite()
  }

  dazed() {
    if (this.state == 'dead' || !this.canMove()) {
      return true;
    } else {
      return false;
    }
  }

  canMove() {
    return (new Date().getTime() - this.lastDazedTime) > 500;
  }

  runState(){
    switch (this.state) {
      case 'standing':
        // console.log("standing");
        this.standing();
        break;
      case 'stalking':
        // console.log("stalking");
        this.stalk();
        break;
      case 'chasing':
        // console.log("chasing");
        this.chase();
        break;
      case 'walking':
        // console.log("walking");
        this.walk();
        break;
      case 'dead':
        // this.dead();
        break;
      case 'injured':
        // console.log("injured");
        break;
      case 'attacking':
        this.punch();
        break;
      default:
        this.standing();
        break;
    }
  }

  standing(time){
    this.busy = true;
    this.sprite.animations.play('idle');
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.busy = false;
  }

  punch(){
    this.busy = true;
    this.sprite.animations.play('punch');
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    setTimeout(function(){
      this.busy = false;
    }.bind(this), 1000);
  }

  injured(){
    this.busy = true;
    this.state = 'injured';
    // this.sprite.body.velocity.x = 0;
    // this.sprite.body.velocity.y = 0;
    this.health -= 5;
    this.scoreText.text = 'health: ' + this.health;
    this.lastDazedTime = new Date().getTime();
    this.busy = false;
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

  stalk(){
    this.busy = true;
    this.sprite.animations.play('walk');
    this.game.physics.arcade.moveToObject(
      this.sprite,
      this.player.sprite,
      60,
      null
    );
    this.busy = false;
  }

  chase(){
    this.busy = true;
    this.sprite.animations.play('run');
    this.game.physics.arcade.moveToObject(
      this.sprite,
      this.player.sprite,
      120,
      null
    );
    this.busy = false;
  }

  walk() {
    this.busy = true;
    this.sprite.animations.play('walk');
    this.game.physics.arcade.moveToXY(
      this.sprite,
      this.randomX,
      this.randomY,
      60,
      null
    );
    this.busy = false;
  }
}
