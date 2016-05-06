// Follows this guide for using Phaser with Webpack: https://github.com/photonstorm/phaser#webpack

var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: ['./lib/game'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: './bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    },
    { test: /pixi.js/, loader: 'script' },
    { test: /p2\.js/, loader: 'expose?p2' },
    { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
    ],
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
    }
  }
}
