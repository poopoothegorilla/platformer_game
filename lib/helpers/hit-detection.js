export default class HitDetection {

  constructor(game, playersGroup, enemiesGroup) {
    this.game = game;
    this.playersGroup = playersGroup;
    this.enemiesGroup = enemiesGroup;
  }

  checkIfAttacking(playerSprite, enemySprite) {
    if (enemySprite.state == 'attacking' && !(playerSprite.busy)){
      console.log(`${enemySprite.name} is attacking ${playerSprite.name}!`)
      return true; // proceed to hitDetected()
    } else {
      return false;
    }
  }

  registerHit(playerSprite, enemySprite) {
    playerSprite.events.isHit.dispatch(this);
  }

  proximityDetection(attacker, target) {
    const hitBox = {
      width: 50,
      thickness: 10,
      x: 0,
      y: 0,
    };

    const thisRight = attacker.x + attacker.width/2;
    const thisLeft = attacker.x - attacker.width/2;
    const thisFar = attacker.y - hitBox.thickness;
    const thisClose = attacker.y + hitBox.thickness;

    const targetRight = target.x + target.width/2;
    const targetLeft = target.x - target.width/2;
    const targetFar = target.y - hitBox.thickness;
    const targetClose = target.y + hitBox.thickness;

    if (this.inZpace(targetClose, targetFar, attacker.y)) {
      if ((target.x < thisLeft) && (target.x > thisLeft - hitBox.width)) {
        return true;
      } else if ((target.x > thisRight) && (target.x < thisRight + hitBox.width)) {
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

  update() {
    this.game.physics.arcade.overlap(
      this.playersGroup,
      this.enemiesGroup,
      this.registerHit,
      this.checkIfAttacking,
      this
    )
  }
}
