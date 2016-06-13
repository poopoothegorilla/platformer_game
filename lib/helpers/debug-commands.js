export function showBodyInfo(game, playersGroup, enemiesGroup) {
  // Draw players' hitboxes & anchor point
  playersGroup.forEachAlive(function(sprite) {
    game.debug.body(sprite, "#9090ff", false)
    game.debug.bodyInfo(sprite, 20, 170, 'white');
    game.debug.pixel(sprite.x, sprite.y, 'red', 4);
  });

  // Draw enemies' hitboxes
  enemiesGroup.forEachAlive(
    function(sprite) {
      game.debug.body(sprite, "#ff9090", false)
      game.debug.bodyInfo(sprite, 20, 170, 'white');
      game.debug.pixel(sprite.x, sprite.y, 'red', 4);
    });
}

export function showSpriteInfo(game, sprite) {
  // Print sprite info to screen
  game.debug.spriteBounds(sprite, "#9090ff", false)
  game.debug.spriteInfo(sprite, 32, 32);
}

export function showSpriteState(game, sprite) {
  // Print sprite state on screen ('stalking', 'busy', etc.)
  game.debug.text(`${sprite.name} state: ${sprite.state}`, game.width/2, 20, 'yellow', 'Segoe UI');
}
