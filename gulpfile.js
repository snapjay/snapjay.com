var gulp = require('gulp');

gulp.task('default', function() {
    // place code for your default task here
});

var app = './public/';
var build = './build/';

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var watch = require('gulp-watch');


//gulp.task('clean', function () {
//    return gulp.src(build, {read: false})
//        .pipe(clean());
//});

gulp.task('build',[ 'templates', 'usemin', 'copy']);


gulp.task('watch', function () {
    gulp.watch(app + 'partials/**/*.html', ['templates']);
});


gulp.task('usemin', function() {
    gulp.src('views/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
//            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            jsapp: [uglify(), rev()],
            assetsDir:app
        }))
        .pipe(gulp.dest(build));
});


gulp.task('templates', function () {
        gulp.src([
            app + 'partials/**/*.html'
        ])
        .pipe(minifyHTML({
            quotes: true,
            base  : 'partials/'
        }))
        .pipe(templates('./templates.js', {standalone :true}))
        .pipe(gulp.dest(app +  'js'));
});

gulp.task('copy', function(){

    gulp.src([app + 'img/**/*.png', app + 'img/**/*.jpg'])
        .pipe(gulp.dest(build + 'img'));

    gulp.src([app + 'img/credits/hills.svg'])
        .pipe(gulp.dest(build + 'img/credits'));

    gulp.src([app + 'video/**/*.*'])
        .pipe(gulp.dest(build + 'video'));

//    gulp.src([app + 'partials/**/*.html'])
//        .pipe(gulp.dest(build + 'partials'));
//
//    gulp.src([app + 'templates/**/*.html'])
//        .pipe(gulp.dest(build + 'templates'));

});



