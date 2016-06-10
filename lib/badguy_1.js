/** Class representing a Thug; a basic mook enemy.
  * This class constructs the sprite & handles functionality.
  */

import {proximityDetection} from './helpers/proximity-detection.js';
import Attacks from './helpers/attack-engine.js';

export default class Thug {

  constructor(game, player, playerGroup, group) {
    this.game = game;
    this.group = group;
    this.player = player;
    this.playerGroup = playerGroup;
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
    this.attacks = null;
  }

  preload(){

  }

  addSpriteEvents() {
    // http://phaser.io/docs/2.4.6/Phaser.Signal.html
    this.sprite.events.isHit = new Phaser.Signal()
    this.sprite.events.isHit.add(() => {
      this.injured();
    });
  }

  updateSprite() {
    // TODO: is this really needed anymore?
    this.sprite.name = this.name;
    this.sprite.health = this.health;
    this.sprite.state = this.state;
  }

  // * Add attackbox group
  // * @private
  _addAttacks() {
    const { sprite, game, playerGroup } = this;
    this.attacks = new Attacks(sprite, playerGroup);

    const xPosRightPunch = (sprite.width/2) * this.size;
    const xPosLeftPunch = (sprite.width/2) / this.size;
    const yPosPunch = -(sprite.height/2);

    this.attacks.create({
      name: 'punch',
      width: 30,
      height: 30,
      xPosRight: xPosRightPunch,
      xPosLeft: xPosLeftPunch,
      yPos: yPosPunch,
      damageValue: 1
    })
  }

  punch(){
    this.sprite.busy = true;
    this.sprite.animations.play('punch');
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.attacks.activate('punch');
    setTimeout(() => {
      this.sprite.busy = false;
    }, 1000) // only punch at most once every second
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
    this.game.physics.enable(this.sprite); // creates body
    this.sprite.busy = false; // default to not busy

    this.health = 15;

    this.updateSprite();
    this._addAttacks()
    this.addSpriteEvents();

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.scale.setTo(this.size, this.size);
    this.sprite.body.syncBounds = true;


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

    // this.sprite.animations.getAnimation('punch').onStart.add(
    //   function () {
    //     (this.sprite.animations.getAnimation('punch'))
    //     this.sprite.busy = true;
    //   }, this
    // );
    //
    // this.sprite.animations.getAnimation('punch').onComplete.add(
    //   function () {
    //     console.log(this.sprite.animations.getAnimation('punch'))
    //     this.sprite.busy = false;
    //   }, this
    // );

    this.sprite.animations.add('injured', ['Evil_punchedLeft.png'], 12, false);
    this.sprite.animations.add('death', ['Evil_deadLeft.png'], 12, false);

    // injured = this.sprite.animations.add('injured', [0, 1, 2, 3, 4, 5, 6, 7], 12, false);
    // injured.onComplete.add(fucntion(){ this.animations.play('')})

    this.scoreText = this.game.add.text(32, 550, 'enemy health: ' + this.health, { font: "20px Arial", fill: "#ffffff", align: "right" });

    this.sprite.body.name = `${this.name}-Body`;
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
      this.runState(); // fire corresponding function for sprite's state

      // If Thug sprite is close to Player sprite
      // and Thug's state is stalking or chasing,
      // change Thug's state to attacking, which fires punch()
      // and also pass Thug's state to its sprite
      if (proximityDetection(this.game, this.sprite, this.player.sprite) && (this.state == 'stalking' || this.state == 'chasing') && this.sprite.busy == false) {
        this.punch();
        this.updateSprite();
      }
    }

    // DEBUG: Show attackbox
    // if (this.sprite.children.length != 0) {
    //   this.game.debug.body(this.sprite.children[0].children[0], "#9090ff", false)
    //   this.game.debug.spriteInfo(this.sprite.children[0].children[0], 32, 256);
    // }


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

  injured(damage, knockback){
    this.sprite.busy = true;
    this.state = 'injured';
    // this.sprite.body.velocity.x = 0;
    // this.sprite.body.velocity.y = 0;
    this.sprite.health -= 1;
    this.scoreText.text = 'health: ' + this.health;
    this.lastDazedTime = new Date().getTime();
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
