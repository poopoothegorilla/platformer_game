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
