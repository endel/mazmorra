/*global -$ */
'use strict';
// generated on 2015-12-22 using generator-modern-frontend 0.2.8
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var through2 = require('through2');
var browserify = require('browserify');

var spritesheet = require('spritesheet-js');

var isDevelopment = (process.env.ENVIRONMENT !== "production");

gulp.task('stylesheet', function () {
  return gulp.src('app/css/main.styl')
    .pipe($.if(isDevelopment, $.sourcemaps.init()))
    .pipe($.stylus({
      errors: true
    }))
    .on('error', function (error) {
      console.log(error, error.stack);
      this.emit('end');
    })
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.if(isDevelopment, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
});

gulp.task('sprites', function() {
  spritesheet('app/images/sprites/*.png', {
    format: 'json',
    path: 'app/images',
    powerOfTwo: true,
    padding: 1
  }, function (err) {
    if (err) throw err;
    console.log('spritesheet successfully generated', arguments);
  });

});

gulp.task('javascript', function () {
  return gulp.src('app/js/main.js')
    .pipe(through2.obj(function (file, enc, next){ // workaround for https://github.com/babel/babelify/issues/46
      browserify({
        entries: file.path,
        debug: isDevelopment
      }).bundle(function(err, res){
        if (err) { return next(err); }

        file.contents = res;
        next(null, file);
      });
    }))
    .on('error', function (error) {
      console.log(error, error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'))
    .pipe($.if(isDevelopment, $.sourcemaps.init({loadMaps: true})))
    .pipe($.if(isDevelopment, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/js'));
});

gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['javascript', 'stylesheet'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app/*.html', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', ['sprites'], function () {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  var pattern = 'app/fonts/**/*'
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat(pattern))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['stylesheet', 'javascript', 'fonts', 'sprites'], function () {
  browserSync({
    ghostMode: false,
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/js/*.{js,jsx}',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch(['app/css/**/*.styl'], ['stylesheet']);
  gulp.watch('app/js/**/*.{js,jsx}', ['javascript']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  // gulp.watch('app/images/sprites#<{(|.png', ['sprites', 'images']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', function () {
  browserSync({
    reloadOnRestart: false,
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/css/*.styl')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/css'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      // exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
