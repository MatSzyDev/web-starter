var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var del = require('del');
var sequence = require('run-sequence');

var config = {
  src: '../',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  scssin: 'src/scss/**/*.scss',
  cssout: '../assets/css/',
  jsout: '../assets/js/',
  imgout: '../assets/img/',
  scssout: '../assets/css/',
  cssoutname: 'master.css',
  jsoutname: 'script.js',
  cssreplaceout: '../assets/css/style.css',
  jsreplaceout: '../assets/js/script.js'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: config.src
  });

  gulp.watch(config.jsin, ['reload']);
  gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src(config.jsin)
    .pipe(concat(config.jsoutname))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

gulp.task('build', function() {
  sequence(['js', 'css', 'img']);
});

gulp.task('default', ['serve']);
