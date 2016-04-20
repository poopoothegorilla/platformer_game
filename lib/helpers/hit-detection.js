export function punchHitDetection(attacker, target) {
  const hitBox = {
    width: 50,
    thickness: 10
  };

  const thisRight = attacker.x + attacker.width/2;
  const thisLeft = attacker.x - attacker.width/2;
  const thisFar = attacker.y - hitBox.thickness;
  const thisClose = attacker.y + hitBox.thickness;

  const targetRight = target.x + target.width/2;
  const targetLeft = target.x - target.width/2;
  const targetFar = target.y - hitBox.thickness;
  const targetClose = target.y + hitBox.thickness;

  if (target.animations.currentAnim.name === 'punch' && this.inZpace(targetClose, targetFar, attacker.y)) {
    if (target.scale.x > 0) {
      if ((targetRight < thisLeft) && (targetRight + hitBox.width > thisLeft)) {
        attacker.body.velocity.y = 0;
        this.injured();
        attacker.body.velocity.x = 1000;
      }
    }
    if (target.scale.x < 0) {
      if ((targetLeft > thisRight) && (targetLeft - hitBox.width < thisRight)) {
        attacker.body.velocity.y = 0;
        this.injured();
        attacker.body.velocity.x = -1000;
      }
    }
  }
}

export function proximityDetection(attacker, target) {
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

export function inZpace(close, far, target) {
  if (target < close && target > far) {
    return true;
  }

  return false;
}
