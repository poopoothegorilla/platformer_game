export default class HitDetection {

  // TODO: Instead of passing in enemiesGroup, pass in particlesGroup

  constructor(game, attackboxGroup, targetGroup) {
    this.game = game;
    this.attackboxGroup = attackboxGroup;
    this.targetGroup = targetGroup;
  }

  update() {
    // Overlap: Checks for overlap between game objects; returns true or false.
    this.game.physics.arcade.overlap(
      this.attackboxGroup,
      this.targetGroup,
      this.registerHit,
      //null,
      this.processOverlap, // If overlap is true, this callback is run to do additional checks. If this in turn returns true, then registerHit is run.
      this
    )
  }

  processOverlap(attackbox, targetSprite) {
    // Only register a hit on the target sprite if:
    // TODO: tune busying logic
    // - neither the attacker nor the target are in busy state
    // if (targetSprite.busy){
    //   return false; // do not proceed to registerHit()
    // } else {
    return true;
    // }
  }

  registerHit(attackbox, targetSprite) {
    // Send an event to targetSprite to deal damage
    targetSprite.events.isHit.dispatch(this);
    // TODO: Give attackbox properties such as damage, knockback, and send that through the isHit event too
  }

}
