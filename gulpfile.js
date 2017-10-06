var projectName = 'mzdesign';
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del');

    gulp.task('jshint', function() {
      return gulp.src(projectName + '/scripts/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
    });

    // Clean
    gulp.task('clean', function() {
        return del(['dist']);
    });

    // Default task
    gulp.task('default', ['clean'], function() {
        gulp.start('usemin', 'imagemin','copyfonts');
    });

    gulp.task('usemin',['jshint'], function () {
    return gulp.src('./' + projectName + '/views/index.pug')
        .pipe(usemin({
          css:[minifycss(),rev()],
          js: [uglify(),rev()]
        }))
        .pipe(gulp.dest('dist/'));
  });

  // Images
  gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src(projectName + '/images/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('dist/images'))
      .pipe(notify({ message: 'Images task complete' }));
  });

  gulp.task('copyfonts', ['clean'], function() {
     gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
     .pipe(gulp.dest('./dist/fonts'));
     gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
     .pipe(gulp.dest('./dist/fonts'));
  });

// Watch
gulp.task('watch', ['browser-sync'], function() {
// Watch .js files
gulp.watch('{' + projectName + '/scripts/**/*.js,' + projectName + '/styles/**/*.css,' + projectName + '/**/*.html}', ['usemin']);
// Watch image files
gulp.watch(projectName + '/images/**/*', ['imagemin']);

});
// browser sync
gulp.task('browser-sync', ['default'], function () {
   var files = [
      projectName + '/**/*.html',
      projectName + '/styles/**/*.css',
      projectName + '/images/**/*.png',
      projectName + '/scripts/**/*.js',
      'dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.pug"
      }
   });
        // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
    });
