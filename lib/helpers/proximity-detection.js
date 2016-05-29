/**
 * Check if a targetPlayer sprite is close by enough, and home in to attack it.
 * This is an AI function.
 * @param {sprite} attacker - The enemy sprite.
 * @param {sprite} targetPlayer - Who/what this sprite should be attacking; in this case, a player.
 */

// TODO: evaluate if this needs rearchitecting when multiple players are introduced

export function proximityDetection(attacker, targetPlayer) {
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

  const targetPlayerRight = targetPlayer.x + targetPlayer.width/2;
  const targetPlayerLeft = targetPlayer.x - targetPlayer.width/2;
  const targetPlayerFar = targetPlayer.y - hitBox.thickness;
  const targetPlayerClose = targetPlayer.y + hitBox.thickness;

  if (inZpace(targetPlayerClose, targetPlayerFar, attacker.y)) {
    if ((targetPlayer.x < thisLeft) && (targetPlayer.x > thisLeft - hitBox.width)) {
      return true;
    } else if ((targetPlayer.x > thisRight) && (targetPlayer.x < thisRight + hitBox.width)) {
      return true;
    }
  }
}

function inZpace(close, far, targetPlayer) {
  if (targetPlayer < close && targetPlayer > far) {
    return true;
  }
    return false;
}
