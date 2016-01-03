var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript');

// paths
var src = './app/**/*.ts';
var dest = './js';

// default task
gulp.task('default', ['watch']);

// when any file in angular app change
gulp.task('watch', function () {
    gulp.watch(src, ['app-concat']);
});

// create a single app.js file
gulp.task('app-concat', function () {
    gulp.src(src)
        .pipe(ts({
            noImplicitAny: true,
            removeComments: true,
            out: 'app.js'
        }))
        .pipe(gulp.dest(dest));
});