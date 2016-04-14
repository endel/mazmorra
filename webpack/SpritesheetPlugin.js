var spritesheet = require('spritesheet-js');

function SpritesheetPlugin (path, options) {
  this.path = path
  this.options = options
}

SpritesheetPlugin.prototype.apply = function (compiler) {
  var plugin = this

  console.log("generating spritesheet...")
  spritesheet(plugin.path, plugin.options, function (err) {
    if (err) throw err;
    console.log("spritesheet generated.")
  });


  // compiler.plugin('run', function (compilation, callback) {
  //   // console.log("emit:", plugin.path, plugin.options);
  //   console.log("generating spritesheet...", compilation)
  //
  //   spritesheet(plugin.path, plugin.options, function (err) {
  //     if (err) throw err;
  //     console.log("spritesheet generated.")
  //     callback()
  //   });
  //
  // })

  // compiler.plugin('done', function() {
  //   console.log('Hello World!');
  // });

};

module.exports = SpritesheetPlugin;
