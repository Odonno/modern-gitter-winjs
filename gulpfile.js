var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript');

// paths
var appSrc = './app/**/*.ts';
var appDest = './dist/modern-gitter';
var backgroundSrc = './background/**/*.ts';
var backgroundDest = './background';

// default task
gulp.task('default', ['watch-app', 'watch-background']);

// when any file in angular app change
gulp.task('watch-app', function () {
    gulp.watch(appSrc, ['app-concat']);
});
// create a single app.js file
gulp.task('app-concat', function () {
    gulp.src(appSrc)
        .pipe(ts({
            noImplicitAny: false,
            removeComments: true,
            out: 'app.js'
        }))
        .pipe(gulp.dest(appDest));
});

// when any file in background folder change
gulp.task('watch-background', function () {
    gulp.watch(backgroundSrc, ['background-compile']);
});
// create *.js file from each *.ts file
gulp.task('background-compile', function () {
    gulp.src(backgroundSrc)
        .pipe(ts({
            noImplicitAny: false,
            removeComments: true
        }))
        .pipe(gulp.dest(backgroundDest));
});