const path = require('path')
const webpack = require('webpack')

const SpritesheetPlugin = require('./webpack/SpritesheetPlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AudioSprite = require("audiosprite-loader");
const TerserPlugin = require('terser-webpack-plugin');

// var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");
const stylusLoader = ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "stylus-loader"] })
const mode = process.env.NODE_ENV || "development";

console.log("PRODUCTION?", (mode === "production"));

module.exports = {
  mode,
  entry: {
    bundle: './client/main.js',
    dungeon_viewer: './client/dungeon_viewer.js'
  },

  output: {
    path: path.join(__dirname, 'public'),
    // filename: 'bundle.js'
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
      { test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
      { test: /\.(wav|ogg|mp3|aif)$/, loader: AudioSprite.loader() }
    ],

  },

  plugins: [
    new AudioSprite.Plugin(),

    new webpack.ProvidePlugin({
      THREE: "three",
      Tweener: "tweener",
      App: [__dirname + "/client/core/App", "default"],
      ResourceManager: [__dirname + '/client/resource/manager', 'default'],
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

  optimization: {
    minimize: (mode === "production"),
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {},
          mangle: true,
          toplevel: true,
          output: {
            comments: false
          }
        }
      })
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }

}
