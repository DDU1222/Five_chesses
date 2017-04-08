var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserSync = require('browser-sync'),
  $ = gulpLoadPlugins(),
  reload = browserSync.reload;

// Copy all dependencies files at the node_module
gulp.task('pixi', function () {
  gulp.src([
    'node_modules/pixi.js/dist/pixi.js',
  ], {
    dot: true
  }).pipe($.newer('src/scripts/'))
    .pipe(gulp.dest('src/scripts/'))
    .pipe($.size({title: 'dependencies scripts'}))
});


//JavaScript uglify & concat
gulp.task('scripts', ['pixi'], function () {
  gulp.src([
      './src/scripts/pixi.js',
      './src/scripts/*.js'
    ])
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
});

//Lint JavaScript
gulp.task('lint', function () {
  gulp.src('src/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
});


// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 10',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

// For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'src/styles/*.scss'
    ])
    .pipe($.sass({
      precision: 10,
      includePaths: ['node_modules/normalize-scss/sass/'],
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.stream());
});


gulp.task('images', function(){
  gulp.src([
      'src/images/*.*'
    ])
    .pipe($.imageResize({
      scale: 0.8,
      imageMagick : true
    }))
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images/'))
    .pipe($.size({title: 'lower'}))
});

gulp.task('default',['styles', 'scripts'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: "./",
      index: "src/index.html"
    },
    port: 8000,
    browser: "google chrome"
  });
  gulp.watch(['src/styles/*.scss'], ['styles'], reload);
  gulp.watch(['src/scripts/*.js'], ['scripts', reload]);
  gulp.watch(['src/*.html'], reload);
});
