var punchHitDetection: function(puncher, target, targetHitbox) {
  targetHitbox = {
    width: 50,
    thickness: 10
  };

  thisRight = puncher.x + puncher.width/2;
  thisLeft = puncher.x - puncher.width/2;
  thisFar = puncher.y - hitBox.thickness;
  thisClose = puncher.y + hitBox.thickness;

  targetRight = target.x + target.width/2;
  targetLeft = target.x - target.width/2;
  targetFar = target.y - hitBox.thickness;
  targetClose = target.y + hitBox.thickness;

  if (target.animations.currentAnim.name === 'punch' && this.inZpace(targetClose, targetFar, puncher.y)) {
    if (target.scale.x > 0) {
      if ((targetRight < thisLeft) && (targetRight + hitBox.width > thisLeft)) {
        puncher.body.velocity.y = 0;
        this.injured();
        puncher.body.velocity.x = 1000;
      }
    }
    if (target.scale.x < 0) {
      if ((targetLeft > thisRight) && (targetLeft - hitBox.width < thisRight)) {
        puncher.body.velocity.y = 0;
        this.injured();
        puncher.body.velocity.x = -1000;
      }
    }
  }
},
