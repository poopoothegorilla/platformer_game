// * Returns a group of attackboxes as a child of the passed-in sprite.
// * @class
// TODO: store damage and knockback values on the attackbox

import HitDetection from './hit-detection.js';

export default class Attacks {
  // * Create a group of attackboxes.
  // * new Group(game, parent, name, addToStage, enableBody, physicsBodyType)
  // * @constructor
  // * @param {object} sprite - the sprite that will have this group of attackboxes attached to it as a child.
  // * @param {object} enemyGroup - what game group these attacks should be hitting.

  constructor(sprite, enemyGroup) {
    this.sprite = sprite;
    this.groupName = `${sprite.name}-Attackboxes`;
    this.group = new Phaser.Group(this.sprite.game, this.sprite, this.groupName, null, true);
    this.enemyGroup = enemyGroup;
    this.hitDetection = new HitDetection(sprite.game, this.group, this.enemyGroup);
  }

  // * Create an attackbox and add it to the sprite's group.
  // * @param {object} params - an object of parameters for the attack.
  // * @param {string} params.name - Name of attack (e.g. punch, kick)
  // * @param {number} params.width - Desired width of attackbox
  // * @param {number} params.height - Desired height of attackbox
  // * @param {number} params.xPosRight - x position of the attackbox when the sprite is facing right
  // * @param {number} params.xPosLeft - x position when sprite is facing left
  // * @param {number} params.yPos - y position
  // * @param {number} params.damageValue - how much damage should the attack do?
  create(params) {
    const {
      name,
      width,
      height,
      xPosRight,
      xPosLeft,
      yPos,
      damageValue
    } = params;

    const { group, sprite } = this;

    // Create a sprite for this attack and attach it to the attack group
    let attackSprite = group.create(0,0,null);
    attackSprite.name = name;
    attackSprite.body.setSize(width, height);
    attackSprite.body.name = `${name}-body`;
    this.xPosRight = xPosRight;
    this.xPosLeft = xPosLeft;
    attackSprite.x = xPosRight; // default to face right
    attackSprite.y = yPos;
    attackSprite.damageValue = damageValue;
  }

  // * Activate an attackbox on the sprite.
  // * Searches through the sprite's attackbox group and activates by attack's name.
  // * @param {string} name - Name of the desired attackbox.
  activate(name) {
    const { group, sprite, hitDetection, xPosLeft, xPosRight } = this;

    // search all the attackboxes
    group.children.forEach((attackboxSprite) => {
      // if we find the attackbox with the "name" specified
      if (attackboxSprite.name === name) {
        if (sprite.direction == 'right') {
          attackboxSprite.x = xPosRight;
        } else if (sprite.direction == 'left') {
          attackboxSprite.x = xPosLeft;
        }
        hitDetection.update(); // check for hit
      }
    })

  }

  debugAttackBody() {
    const { game } = this.sprite;
    this.group.forEachAlive(function(sprite) {
      game.debug.body(sprite, "#9090ff", false)
      game.debug.bodyInfo(sprite, 20, 170, 'white');
      game.debug.pixel(sprite.x, sprite.y, 'red', 4);
    });
  }
}
