# Namely platformer game

## To run the game
1. In a terminal, type in `python -m SimpleHTTPServer 8000`
2. In a browser, go to `localhost:8000`
3. Game should now be running! Press the arrow keys to move around and spacebar to attack.

## For Developers
### Getting Started
1. `git clone` this repo to your computer.
2. Go to that directory in a terminal, and run `npm install` to install Webpack and Babel (required to transpile es6 to browser-usable Javascript).
3. Then, run `npm start`, which will run `webpack --watch`, which bundles the JS. *Note: Webpack doesn't watch webpack.config.js, so if you change something there, you'll need to restart `npm start`. Sorry!*

### Dependencies
- Webpack: runs our js files through the Babel transpiler (explained below) and bundles them into a minified `/dist/bundle.js` file.
- Babel: transpiles Javascript written in the es6 standard (which is not yet supported by browsers) into old-school Javascript that browsers can run.
  - *Why es6?* es6 introduces modules, allowing us to export our js partials and import them into each other, allowing for easier organization and avoiding needing to import them all as `<script>` tags in `index.html`, which in turn also allows us to stop worrying about the order in which those js scripts are loaded! :D (es6 also has a bunch of other new features, but for now I'm only using the module feature to keep complexity down.)
- Phaser: our game engine! Included as a node module so we can bundle it up with Webpack too (see https://github.com/photonstorm/phaser#webpack)

<<<<<<< HEAD
### Glossary
- actor: basically a player or an enemy; something that can attack, take damage, has HP, and can die.
- hitbox: the area in which, if an attack lands, would register damage onto the actor to which the hitbox belongs. It would also be the area concerned with collision. Phaser-wise, it's the actor's sprite/collision body.
- attackbox: basically an attack's hitbox; the area around a fist or bullet for example, which, if it collides with a hitbox, would register a hit.

=======
>>>>>>> 214816e357bbe99fa6418de9ec76512a01a141e8
### FAQ
**I'm getting a "This seems to be a pre-built javascript file" error for p2 (or something else) -- what gives?!**
  Unfortunately Phaser doesn't play well with Webpack or other bundlers such as Browserify; see the bajillion issues on the Phaser github for more details. This will probably be less of a problem when Lazer (aka Phaser 3, which is Phaser updated for es6) is released, but for now, this should be an ignorable warning. JS dependency management is hell :/
**Ugh how do these es6 import/exports even work**
  Here's a good reference: http://exploringjs.com/es6/ch_modules.html

**How do I write a plain ole Javascript object constructor & prototype as an es6 class?**
  This:
  ```
  Player = function(attrVal) {
    this.attr = attrVal;
  }

  Player.prototype = {
    methodOne: function() {
      return stuff;
    },
    methodTwo: function(param) {
      return param;
    }
  }
  ```
  is now this:
  ```
  class Player {
    constructor(attrVal) {
      this.attr = attrVal;
    }

    methodOne() {
      return stuff;
    }

    methodTwo(param) {
      return param;
    }
  }
  ```
  Note:
  - Don't put commas in between the es6 class's methods
  - The object constructor is now inside the class at the top
  - No need for `: function()` to declare the methods
  - `export default` is for exporting it as an es6 module, for import elsewhere.

**What's () => ?**
  When you need to write a function with its parent's `this` bound to it, you would ordinarily do:
  ```
  function() {
    ...
  }.bind(this)
  ```
  `() =>` just shortcuts the `function` keyword and the `this` binding, so the above is now the neat and tidy:

  ```
  () => {
    ...
  }
  ```
