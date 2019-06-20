const path = require('path')
const webpack = require('webpack')

const SpritesheetPlugin = require('./webpack/SpritesheetPlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AudioSprite = require("audiosprite-loader");

// var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");
const stylusLoader = ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "stylus-loader"] })
const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
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
      { test: /\.(woff|woff2|eot|ttf|svg|jpg)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
      { test: /\.(wav|ogg|mp3|aif)$/, loader: AudioSprite.loader() }
    ],

  },

  plugins: [
    new AudioSprite.Plugin(),

    new webpack.ProvidePlugin({
      THREE: "three",
      Tweener: "tweener",
      App: __dirname + "/client/core/App",
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
