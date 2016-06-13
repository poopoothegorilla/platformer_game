/* Class representing the Patrick Dino boss enemy.
 * He is a big ole dino dude! Level One boss.
 * Attack List:
 * - attackhere
 */
import {proximityDetection} from '../helpers/proximity-detection.js';
import Attacks from '../helpers/attack-engine.js';

 export default class PatDino {
   /* @constructor
    * @param {object} game - The current game instance.
    * @param {object} group - The Phaser group that this sprite should be added to; in this case, the enemy group.
    * @param {object} playerGroup - The group of actors that PatDino should be doing damage to (opponent group; the players, in this case)
    */
   constructor(game, group, playerGroup) {
     this.game = game;
     this.group = group,
     this.playerGroup = playerGroup;
     this.name = "Boss-PatDino";

     // Generate sprite
     this.sprite = game.add.sprite(
       this.game.camera.x + this.game.width + 25,
       this.game.height/2 + 50,
       'assets',
       'Evil_standing1.png'
     );

     // Generate Phaser group for attacks
     this.attacks = new Attacks(this.sprite, playerGroup);

     // Starting state
     this.sprite.state = 'stalking';
   }

   create() {
     const { game, group, sprite } = this;

     game.time.events.loop(Phaser.Timer.SECOND * 1.5, this._updateState, this);

     this._createSprite();
     this._addAnimations();
   }

   update() {
     this._move();d
   }

   // Private

   _updateState(){
       //if (!this.dazed()) {
         let stateChoices = ['standing', 'stalking', 'chasing', 'walking'];
         this.state = stateChoices[this.game.rnd.between(0,3)];

         if(this.state == 'walking'){
           this.randomX = this.game.rnd.between(25, this.game.width-25);
           this.randomY = this.game.rnd.between((this.game.height/2 + 50), (this.game.height-100));
         }
       //}
    }

   _move() {
     if (this.sprite.body.velocity.x != 0){
       this.sprite.body.velocity.x *= .75;
       if(this.sprite.body.velocity.x < .005 && this.sprite.body.velocity.x > -.005){
         this.sprite.body.velocity.x = 0;
       }
     }

     //if (!this.dazed()) {
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
       if (proximityDetection(this.game, this.sprite, this.player.sprite) && this.sprite.busy == false) {
         //this.punch();
       }
     //}
   }

   _createSprite() {
     const { game, group } = this;
     let sprite = this.sprite;

     group.add(sprite);
     game.physics.enable(sprite); // create physics body for this sprite
     sprite.busy = true; // default to busy for opening boss animation

     sprite.name = `PatDino`;
     sprite.body.name = `${this.name}-Body`;
     sprite.maxHealth = 100;
     sprite.anchor.setTo(0.5, 1);
     sprite.scale.setTo(1, 1);
     sprite.body.syncBounds = true;
   }

   _addAnimations() {
     const { sprite } = this;

     this.sprite.animations.add('idle', ['Evil_standing1.png','Evil_standing2.png'], 12, false);
     this.sprite.animations.add('walk', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
     this.sprite.animations.add('run', ['Evil_walkingRight1.png','Evil_walkingRight2.png'], 12, false);
     this.sprite.animations.add('punch', ['Evil_punchingRight.png'], 12, false);
     this.sprite.animations.add('injured', ['Evil_punchedLeft.png'], 12, false);
     this.sprite.animations.add('death', ['Evil_deadLeft.png'], 12, false);
   }

   /* Add Phaser Signals (events) to the sprite.
    * @private
    */
   _addSpriteEvents() {
     /* isHit - used by HitDetection engine to apply damage to PatDino.
     */
     this.sprite.events.isHit = new Phaser.Signal();
     this.sprite.events.isHit.add(() => {
       this.injured();
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