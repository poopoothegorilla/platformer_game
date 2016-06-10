// TODO:
// Four functions, one for each possible player, (or one dynamic function?) rendered along the top of the game
// Exact positions can be declared since if that player is dead or not in yet, can show a "Join game" placeholder

export default class HealthBars {
  constructor(game) {
    this.game = game;
  }

  renderPlayerHealthBar(player) {
    const style = {
      font: "16px Arial",
      fill: "#ff0044",
      wordWrap: true,
      wordWrapWidth: 100,
      align: "center",
      backgroundColor: "#ffff00"
    };
    let bar = new Phaser.Graphics(this.game, 10, 10)
    bar.lineTo(5000, 10);
    bar.lineStyle(20, 1, 1)
    this.game.add.text(10, 10, `${player.name}: `, style)

    this.game.add.text(100, 10, `${player.health}`, style);

    return bar;
  }

  updateHealthBar(bar, value) {
    //return bar.setText(value)
  }
  // TODO: probably a destroyHealthBar or replace health bar with "Press Start"/"Join Game" UI
}
