export function showBodyInfo(game, playersGroup, enemiesGroup) {
  // Render "debug mode on" message
  game.debug.text(`Debugging Hitboxes on Phaser ${Phaser.VERSION}`, 20, 20, 'yellow', 'Segoe UI');

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
