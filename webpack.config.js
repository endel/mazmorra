var path = require('path')
var webpack = require('webpack')

var SpritesheetPlugin = require('./webpack/SpritesheetPlugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AudioSprite = require("audiosprite-loader");

// var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");
var stylusLoader = ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "stylus-loader"] })


module.exports = {
  mode: "development",
  entry: './client/main.js',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },

  devtool: 'source-map',

  devServer: {
    host: '0.0.0.0',
    contentBase: './public',
  },

  module: {
    rules: [
      {
        test: /.*\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      { test: /\.styl$/, loader: stylusLoader },
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
      { test: /\.(wav|mp3)$/, loader: AudioSprite.loader() }
    ],

  },

  plugins: [
    new AudioSprite.Plugin(),

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
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }

}
