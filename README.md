# Namely platformer game

# Getting Started
1. Run `npm install` to install Webpack and Babel (required to transpile es6 to browser-usable Javascript).
2. Then, run `npm start`, which will run `webpack --watch`, which bundles the JS. *Note: Webpack doesn't watch webpack.config.js, so if you change something there, you'll need to restart `npm start`. Sorry!*

# Dependencies
- Webpack: runs our js files through the Babel transpiler (explained below) and bundles them into a minified `/dist/bundle.js` file.
- Babel: transpiles Javascript written in the es6 standard (which is not yet supported by browsers) into old-school Javascript that browsers can run.
  - *Why es6?* es6 introduces modules, allowing us to export our js partials and import them into each other, allowing for easier organization and avoiding needing to import them all as `<script>` tags in `index.html`, which in turn also allows us to stop worrying about the order in which those js scripts are loaded! :D (es6 also has a bunch of other new features, but for now I'm only using the module feature to keep complexity down.)
- Phaser: our game engine! Included as a node module so we can bundle it up with Webpack too (see https://github.com/photonstorm/phaser#webpack)

# FAQ
**I'm getting a "This seems to be a pre-built javascript file" error for p2 (or something else) -- what gives?!**
  Unfortunately Phaser doesn't play well with Webpack or other bundlers such as Browserify; see the bajillion issues on the Phaser github for more details. This will probably be less of a problem when Lazer (aka Phaser 3, which is Phaser updated for es6) is released, but for now, this should be an ignorable warning. JS dependency management is hell :/
