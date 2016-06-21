/**
 * Check if a targetPlayer sprite is close by enough, and home in to attack it.
 * This is an AI function.
 * @param {sprite} attacker - The enemy sprite.
 * @param {sprite} targetPlayer - Who/what this sprite should be attacking; in this case, a player.
 */

// TODO: evaluate if this needs rearchitecting when multiple players are introduced

export function proximityDetection(game, attacker, targetPlayer) {
  let hitBox = {
    width: 50,
    thickness: 10,
    x: 0,
    y: 0,
  };

  const targetPlayerFar = targetPlayer.y - hitBox.thickness;
  const targetPlayerClose = targetPlayer.y + hitBox.thickness;

  if (inZpace(game, targetPlayerClose, targetPlayerFar, attacker.y)) {
    if ((targetPlayer.x < attacker.left) && (targetPlayer.x > attacker.left - hitBox.width)) {
      return true;
    } else if ((targetPlayer.x > attacker.right) && (targetPlayer.x < attacker.right + hitBox.width)) {
      return true;
    }
    return false;
  }
}

/**
 * Checks if the targetPlayer is less than a "close" bounding value, and greater than a "far" bounding value
 * This ensures that enemies punch towards the "center" of the target's body, rather than colliding above it and punching the thin air above the target.
 * @param {number} close
 * @param {number} far
 * @param {number} targetPlayerY
 */

function inZpace(game, close, far, targetPlayerY) {
  //game.debug.text(`Debugging inZpace Close: ${close}, Far: ${far}, targetPlayer: ${targetPlayerY}`, 200, 200, 'yellow', 'Segoe UI');
  if (targetPlayerY < close && targetPlayerY > far) {
    return true;
  }
    return false;
}
