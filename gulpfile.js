"use strict";

// Load plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    del = require('del');

// source files paths
var srcdir = 'assets';
var src = {
  html: [srcdir+'/*.html'],
  css: [srcdir+'/styles/**/*.css'],
  js: [srcdir+'/scripts/**/*.js'],
  images: [srcdir+'/images/**']
}

// distribution files paths
var distdir = 'dist';
var dist = {
  css: distdir + '/styles/',
  js: distdir + '/scripts/',
  images: distdir + '/images/',
  vendor: distdir + '/vendor/',
  all: distdir + '/**'
}

// minify app files
gulp.task('assets', function(){
  return gulp.src(src.html)
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(distdir))
});

// Images
gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist.images))
});

// lint scripts code
gulp.task('lint', function() {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// run server
 gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: distdir
    }
  })
})

// Clean
gulp.task('clean', function() {
  return del(distdir);
});

// Watch
gulp.task('watch', ['browserSync'], function() {
  // Watch app source files
  gulp.watch([src.html, src.css, src.js], ['assets', 'lint']);
  gulp.watch(src.js, ['lint']);
  // Watch image files
  gulp.watch(src.images, ['images']);

  // Watch any files in dist/, reload on change
  gulp.watch(dist.all).on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('assets', 'images', 'lint', 'watch');
  notify({ message: 'Default task complete' });
});

// Build task
gulp.task('build', ['clean', 'assets', 'lint', 'images'], function() {
  notify({ message: 'Build task complete' })
});
