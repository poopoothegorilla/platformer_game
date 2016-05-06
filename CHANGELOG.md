platformer_game
==========================

## v0.1.1 - 4/23/16

### General Changes:
- Introduced es6 (aka es2015) and consequently Webpack and Babel as dependencies to transpile it
- Added a package.json and README
- Converted a lot of stuff (TODO: list) to es6 classes and modules
- Index.html now loads one bundled js file (`dist/bundle.js`), and js partials are now bundled instead of being loaded into index.html in multiple `<script>` tags
- Added a basic event handling system patterned after node.js's to (hopefully!) improve handling hit detection & damage distribution when multiple players and enemies are present

### Game Logic:
- Hit detection is now handled via a hit detection engine that exists on the game level, instead of on the individual player or enemy object. It leverages the `overlap` method in the Phaser Arcade engine to automatically detect if any player and any enemy sprite overlap, check if an attack has registered, and then fire Phaser events to distribute damage. This should make hit detection and damage distribution generally easier to reason about and handle, especially once we get
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
