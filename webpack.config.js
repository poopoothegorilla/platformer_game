var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['./lib/game'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: './bundle.js'
  },
  module: {
    loaders: [{
      test: /\.es6?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }],
  }
}
