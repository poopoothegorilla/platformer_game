platformer_game
==========================

## v0.2.1 - 6/10/16
- Upgraded to Phaser Dev branch (2.4.9)! This is indeed risky, but the dev branch has some fixes to some broken sprite behavior that was preventing attackboxes from working correctly.

### New Features:
- Introducing hitboxes for attacks (referred to as "attackboxes" in code) -- attackboxes are basically sprites that represent the area of an attack. It's rendered as an empty sprite around where we'd like to say a hit connected; for example, a punch hitbox is rendered around the player's fist.
  - Now, instead of trying to detect hits by seeing if two actors (enemies or players) collide, which leads to all sorts of inconsistencies and buggy behavior (e.g. the player can have their back to the enemy and punch, and the enemy will still register a hit since we're only checking for collisions between their sprites), we detect if an attackbox has collided with an enemy's hitbox, and then register a hit to the hit enemy.
  - This will also theoretically allow for tuning difficulty: we can make player attackboxes bigger than the enemies' to make the game easier (or harder by making them smaller!)
- Also introduces keybindings in the `player` object; Phaser's `input` has an `addKeys` method, which allows you to basically alias keybindings in the `player` object instead of explicitly calling the keycode. For example, when we have multiple players who need to be bound to different keyboard keys, instead of this kind of code:
```
if (this player is playerOne) {
  if (keyboard.keyCode.LEFT.isDown) {
    moveLeft()
  }
} else if (this player is playerTwo) {
  if (keyboard.keyCode.A.isDown) {
    moveLeft()
  }
}
```
We can have this kind of code in the `player` object, which assigns `moveLeft()` function as a callback, bound to the generic concept of `left` instead of the explicit key:
```
let keybindingsForPlayerOne = this.game.input.keyboard.addKeys(
  { 'left': Phaser.KeyCode.LEFT }
);
let keybindingsForPlayerTwo = this.game.input.keyboard.addKeys(
  { 'left': Phaser.KeyCode.A }
);

this.keybindings.left.onHoldCallback = this.moveLeft;
```
`addKeys` can accept any sort of alias, so we can do this for `punch`, `kick`, `start`, etc!
- Debugging functions! Sprite body outlines and sprite info can now be printed to the screen (no console commands yet, has to be done in code)

### General Refactoring:
- Removed no-longer-needed custom EventEmitter in favor of Phaser's event system (`Signal`)
- Removed some unused variables in Proximity Detection
- Moved Proximity Detection into its own file/module, to shrink the size of the `badguy_1` file
- Instead of calculating a sprite's left and right bounds manually, use Phaser's Sprite's `left` & `right` properties
- Renamed `badguy` & `player` params to `attacker` & `targetPlayer`, just for increased clarity

## v0.1.1 - 4/23/16

### General Changes:
- Introduced es6 (aka es2015) and consequently Webpack and Babel as dependencies to transpile it
- Added a package.json and README
- Converted a lot of stuff (TODO: list) to es6 classes and modules
- Index.html now loads one bundled js file (`dist/bundle.js`), and js partials are now bundled instead of being loaded into index.html in multiple `<script>` tags
- Added a basic event handling system patterned after node.js's to (hopefully!) improve handling hit detection & damage distribution when multiple players and enemies are present

### Game Logic:
- Hit detection is now handled via a hit detection engine that exists on the game level, instead of on the individual player or enemy object. It leverages the `overlap` method in the Phaser Arcade engine to automatically detect if any player and any enemy sprite overlap, check if an attack has registered, and then fire Phaser events to distribute damage. This should make hit detection and damage distribution generally easier to reason about and handle, especially once we get multiple players!
  - Players are now stored in the group `playersGroup`
  - Switched over to using the Phaser method `overlap` in `Phaser.Physics.Arcade`, which does all the work of checking collision between sprites for us, eliminating the need for the methods `punchHitDetection` and `inZpace`
    - *Aside:* `overlap` is actually very powerful; not only can you pass an individual `sprite` or `Group` or `ParticleEmitter` into it, you can also pass an Array of sprites or groups or particle emitters, which will be super useful if/when we introduce different kinds of enemies, pickups, or special attacks like flame attacks. (Doc: http://phaser.io/docs/2.4.7/Phaser.Physics.Arcade.html#overlap)
    - `overlap` also returns the colliding sprites into your provided callbacks. Hooray!
- Changed from storing states as numbers 0-6, to descriptive strings such as `standing`, `stalking`, `attacking`
  - State randomization is now done by storing the string choices in an array and choosing a random number between the array's indices, so:
  ```
  var myChoices = ['thing1', 'thing2', 'thing3'];
  var randomThing = myChoices[randNumBetween(0, 2)];
  ```
- Certain attributes on the Thug and Player object are now passed into its sprite, for use in the hit detection engine.
