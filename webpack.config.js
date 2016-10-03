var path = require('path')
var webpack = require('webpack')

var SpritesheetPlugin = require('./webpack/SpritesheetPlugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");
var stylusLoader = ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!stylus-loader' });

module.exports = {
  entry: ["webpack-dev-server/client?http://localhost:8080", './client/main.js'],
  // entry: './client/main.js',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },

  devtool: 'source-map',

  devServer: {
    contentBase: './public',
  },

  module: {
    rules: [
      {
        test: /.*\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.styl$/, loader: stylusLoader },
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
    ],

  },

  plugins: [
    new webpack.ProvidePlugin({
      THREE: "three",
      Tweener: "Tweener",
      App: __dirname + "/client/core/app",
      ResourceManager: __dirname + '/client/resource/manager',
      config: __dirname + '/client/config'
    }),

    new ExtractTextPlugin("style.css"),

    new SpritesheetPlugin(__dirname + "/public/images/sprites/*.png", {
      format: 'json',
      path: "public/images",
      powerOfTwo: true,
      padding: 1
    })
  ]

}
