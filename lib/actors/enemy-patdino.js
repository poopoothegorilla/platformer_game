/* Class representing the Patrick Dino boss enemy.
 * He is a big ole dino dude! Level One boss.
 * Attack List:
 * - attackhere
 */
import * as Debugger from '../helpers/debug-commands.js';
import { proximityDetection, findNearestFromGroup } from '../helpers/proximity-detection.js';
import Attacks from '../helpers/attack-engine.js';

 export default class PatDino {
   /* @constructor
    * @param {object} game - The current game instance.
    * @param {object} group - The Phaser group that this sprite should be added to; in this case, the enemy group.
    * @param {object} opponentGroup - The Phaser group of actors that PatDino should be doing damage to (players, in this case)
    */
   constructor(game, group, playerGroup) {
     this.game = game;
     this.group = group,
     this.opponentGroup = playerGroup;
     this.size = 1;

     // Generate sprite
     this.sprite = game.add.sprite(
       this.game.camera.x + this.game.width + 25,
       this.game.height/2 + 50,
       'assets',
       'Evil_standing1.png'
     );
     this.sprite.name = "Boss-PatDino";

     // Generate Phaser group for attacks
     this.attacks = new Attacks(this.sprite, this.opponentGroup);

     // Who PatDino is currently attacking
     // By default, nearest player
     this.target = findNearestFromGroup(this.sprite, this.opponentGroup);
   }

   preload() {}

   create() {
     const { game, group, sprite } = this;

     game.time.events.loop(Phaser.Timer.SECOND * 1.5, this._updateState, this);

     this._createSprite();
     this._addSpriteEvents();
     this._addAnimations();
     this._addAttacks();
   }

   update() {
     const { game, sprite, opponentGroup, target } = this;

     Debugger.showSpriteState(game, sprite)

     // Make sprite move slightly faster over time
     // and zero-out sprite's velocity if its too low.
     if (sprite.body.velocity.x != 0) {
       sprite.body.velocity.x *= .75;
       if(sprite.body.velocity.x < .005 && sprite.body.velocity.x > -.005) {
         sprite.body.velocity.x = 0;
       }
     }

     if (sprite.alive) {
       // TODO: deal with equal case
       if (target.x < sprite.x) { // if target is to the left of PatDino
         sprite.data.direction = 'left';
       } else {
         sprite.data.direction = 'right';
       }

       if (sprite.data.direction == 'left') {
         sprite.scale.x = -(this.size); // make sprite face left
       } else if (sprite.data.direction == 'right') {
         sprite.scale.x = this.size;
       }

       if (proximityDetection(game, sprite, target) && sprite.busy == false) {
         sprite.data.state = 'attacking';
       }

       this._runState();
     }
   }

   // Actions & Animations

   // * Stop moving = stop sprite's movement
   // * Non-busy action.
   stopMoving() {
      this.sprite.body.velocity.set(0);
   }

   // * Stalking = walking towards the target.
   // * Non-busy action.
   stalk() {
     const { game, sprite, target } = this;
     sprite.data.state = 'stalking';
     sprite.animations.play('walk');
     sprite.busy = false;
     // http://phaser.io/docs/2.4.8/Phaser.Physics.Arcade.html#moveToObject
     game.physics.arcade.moveToObject(sprite, target, 60)

     // if PatDino is close to the player, switch to chase
   }

   // * Attacking = attacking the target
   // * Whether this is busy or not might depend on the attack
   attack() {
     const { game, sprite, target, attacks } = this;
     sprite.data.busy = true;
     this.stopMoving();
     attacks.activate('punch');
     sprite.animations.play('punch').onComplete.add(() => {
       setTimeout(() => {
         sprite.data.busy = false;
         sprite.data.state = 'stalking';
       }, 1000) // only punch at most every 1000 ms
     });
   }


   // * Injured = take damage and/or knockback, and play an injured animation.
   // * Busy action.
   // TODO: Could probably separate animating & damaging (biz logic I guess?) concerns; injured() and damage() seem a bit muddied together right now
   injured(damage) {
     const { game, sprite } = this;
     sprite.busy = true;
     sprite.data.state = 'injured';
     // TODO: tune length of this anim, could prob hold longer
     sprite.animations.play('injured').onComplete.add(function() {
       sprite.data.state = 'stalking';
       sprite.busy = false;
     });
     sprite.damage(damage);

     // Update healthbar
     game.healthbars.updateHealthBar(sprite.name, sprite.health);
   }

   // * Dead = health is zero; animate death and perform cleanup
   // * Busy action.
   dead() {
     const { game, sprite } = this;
     sprite.alive = false;
     sprite.busy = true;

     this.stopMoving();
     sprite.animations.stop(); // halt all previous animations
     sprite.animations.play('death');

     // Animate flash
     game.add.tween(sprite).to(
       { alpha: 0 }, //properties
       360, //duration in frames
       null, //ease
       true, //autoStart
       0,  //delay
       3, //how many repeats
       false //yoyo
     ).onComplete.add(function() {
       // TODO: would be nice to make this use destroy() instead to completely remove it from game logic
       sprite.kill();
     });
   }

   // Private

   // * Run the function that corresponds to the state the actor is in.
   _runState() {
     switch (this.sprite.data.state) {
       case 'stalking':
         this.stalk();
         break;
       case 'attacking':
         this.attack();
       default:
         this.sprite.data.state = 'standing';
         break;
     }
   }

   _updateState(){
       //if (!this.dazed()) {
        //  let stateChoices = ['standing', 'stalking', 'chasing', 'walking'];
        //  this.state = stateChoices[this.game.rnd.between(0,3)];
         //
        //  if(this.state == 'walking'){
        //    this.randomX = this.game.rnd.between(25, this.game.width-25);
        //    this.randomY = this.game.rnd.between((this.game.height/2 + 50), (this.game.height-100));
        //  }
       //}
    }

   _createSprite() {
     const { game, group } = this;
     let sprite = this.sprite;

     group.add(sprite);
     game.physics.enable(sprite); // create physics body for this sprite
     sprite.busy = false; // default to not busy

     sprite.body.name = `${sprite.name}-Body`;
     sprite.maxHealth = 100;
     sprite.health = sprite.maxHealth; // initialize with maxHealth
     sprite.anchor.setTo(0.5, 1);
     sprite.scale.setTo(this.size, this.size);
     sprite.body.syncBounds = true;

     // Set sprite's initial state
     sprite.data.state = 'stalking';

   }

   _addAnimations() {
     const { game, sprite } = this;

     this.sprite.animations.add('idle', ['Evil_standing1.png','Evil_standing2.png'], 12, false);
     this.sprite.animations.add('walk', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
     this.sprite.animations.add('run', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
     this.sprite.animations.add('punch', ['Evil_punchingRight.png'], 12, false);
     this.sprite.animations.add('injured', ['Evil_punchedLeft.png'], 12, false);
     this.sprite.animations.add('death', ['Evil_deadLeft.png'], 12, false);

     sprite.data.direction = 'right'; //default to right
   }

   /* Add Phaser Signals (events) to the sprite.
    * @private
    */
   _addSpriteEvents() {
     /* isHit - used by HitDetection engine to apply damage to PatDino.
     */
     const { events } = this.sprite;
     events.isHit = new Phaser.Signal();
     events.isHit.add((damage) => {
       this.injured(damage);
     })

     events.onZeroHealth = new Phaser.Signal();
     events.onZeroHealth.add(() => {
       this.dead();
     })
   }

   /* Build PatDino's attacks.
    * @private
    */
   _addAttacks() {
     const { sprite, attacks } = this;

     const xPosRightPunch = (sprite.width/2) * this.size;
     const xPosLeftPunch = (sprite.width/2) / this.size;
     const yPosPunch = -(sprite.height/2);

     attacks.create({
       name: 'punch',
       width: 30,
       height: 30,
       xPosRight: xPosRightPunch,
       xPosLeft: xPosLeftPunch,
       yPos: yPosPunch,
       damageValue: 1
     })
   }
 }
