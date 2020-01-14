// конфигурация Gulp.js

const
  // модули
  gulp = require('gulp'),
  noop = require('gulp-noop'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlclean = require('gulp-htmlclean'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  terser = require('gulp-terser'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),

  // режим разработки
  devBuild = (process.env.NODE_ENV !== 'production'),

  stripdebug = devBuild ? require('gulp-strip-debug') : null,
  sourcemaps = devBuild ? require('gulp-sourcemaps') : null,

  // автообновление в браузере для отслеживания изменений
  browserSync = require('browser-sync').create(),

//шрифты
  fontFiles = [
     './src/font/*.ttf',
     './src/font/*.eot',
     './src/font/*.woff',
     './src/font/*.svg'
  ]

  // папки
  src = 'src/',
  build = 'build/'
  ;

  // обработка изображений
  function images() {

    const out = build + 'img/';

    return gulp.src(src + 'img/**/*')
      .pipe(newer(out))
      .pipe(imagemin({ optimizationLevel: 5 }))
      .pipe(gulp.dest(out));

  };
  exports.images = images;

  function font() {
     return gulp.src(fontFiles)
     .pipe(gulp.dest('./build/font'))
     .pipe(browserSync.stream());
  }

  function json() {
     return gulp.src('./src/json/*.json')
     .pipe(gulp.dest('./build/json'))
     .pipe(browserSync.stream());
  }

  // обработка HTML
  function html() {
    const out = build;

    return gulp.src(src + '**/*.html')
      .pipe(newer(out))
      .pipe(devBuild ? noop() : htmlclean())
      .pipe(gulp.dest(out));
  }

  exports.html = gulp.series(images, font, json, html);

  // обработка JavaScript
  function js() {

    return gulp.src(src + 'js/**/*')
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(deporder())
      .pipe(concat('script.js'))
      .pipe(stripdebug ? stripdebug() : noop())
      .pipe(terser())
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(gulp.dest(build + 'js/'));

  }
  exports.js = js;

  // обработка CSS
function css() {

  return gulp.src(src + 'scss/style.scss')
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: '/img/',
      precision: 3,
      errLogToConsole: true
    }).on('error', sass.logError))
    // .pipe(concat('style.css'))
    .pipe(postcss([
      assets({ loadPaths: ['img/'] }),
      autoprefixer({ overrideBrowserslist: ['last 2 versions', '> 2%'] }),
      mqpacker,
      cssnano
    ]))
    .pipe(sourcemaps ? sourcemaps.write() : noop())
    .pipe(gulp.dest(build + 'css'))
    .pipe(browserSync.stream());

}
exports.css = gulp.series(images, css);

// Запуск всех тасков
// Можно parallel вместо series, но предпочитаю последовательность сборки, особенно если большие проекты
exports.build = gulp.series(exports.html, exports.css, exports.js);

// Следим за изменениями файлов
function watch(done) { // (done)
  browserSync.init({
    server: "build"
  });
  gulp.watch('font/**/*', font)
  gulp.watch('json/**/*', json)
  gulp.watch(src + 'img/**/*', images);
  gulp.watch(src + 'scss/**/*', css);
  gulp.watch(src + 'js/**/*', js);
  gulp.watch(src + '**/*.html', html).on('change', browserSync.reload);

  done();

}
exports.watch = watch;

// Собираем и отслеживаем изменения файлов.
// Откроется локально с автообновлением страницы при изменениях файлов и картинок =)
exports.start = gulp.series(exports.build, exports.watch);
