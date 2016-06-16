// TODO:
// Four functions, one for each possible player, (or one dynamic function?) rendered along the top of the game
// Exact positions can be declared since if that player is dead or not in yet, can show a "Join game" placeholder

export default class HealthBars {
  constructor(game) {
    this.game = game;
    this.bars = [];
    this.updateHealthBar = function(barName, value) {
      // Search bars array and update named bar
      this.bars.forEach(function(bar) {
        if (bar.name == barName) {
          bar.setText(`${bar.name}: ${value}`)
        }
      });
    };
  }

  renderPlayerHealthBar(player) {
    const style = {
      font: "16px Arial",
      fill: "#ff0044",
      wordWrap: true,
      wordWrapWidth: 300,
      align: "center",
      backgroundColor: "#ffff00"
    };
    let bar = this.game.add.text(10, 10, `${player.health}: ${player.name}: `, style);
    bar.name = player.name;

    this.bars.push(bar);
    return bar;
  }

  renderBossHealthBar(boss) {
    const style = {
      font: "16px Arial",
      fill: "#ff0044",
      wordWrap: true,
      wordWrapWidth: 300,
      align: "center",
      backgroundColor: "#ffff00"
    };
    console.log(boss)

    let bar = this.game.add.text(10, 40, `${boss.name}: ${boss.health}`, style);
    bar.name = boss.name;

    this.bars.push(bar);
    return bar;
  }

  // TODO: probably a destroyHealthBar or replace health bar with "Press Start"/"Join Game" UI
}
