/* Make JShint stop yelling: DO NOT REMOVE */
/* jshint undef:false, unused:false, strict:false */

//
// Plugins
//
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    watch = require('gulp-watch'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-stylus'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    // axis = require('axis'),
    // jeet = require('jeet'),
    // rupture = require('rupture'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint');

//
// Sources
//
var sources = {
    html: 'public/**/*.html',
    images: 'img/**/*',
    favicon: 'favicon.ico',
    stylus: 'stylus/**/*',
    fonts: 'fonts/**/*',
    js: 'js/*.js',
    vendorjs: [
        'js/vendor/*.js'
    ]
};

//
// Destinations
//
var destinations = {
    root: '',
    images: 'public/img/',
    styles: 'public/css/',
    fonts: 'public/fonts/',
    js: 'public/js/'
};

gulp.task('stylus', function () {
    gulp.src('./stylus/site.styl')
        .pipe(plumber({
            errorHandler: notify.onError({
                sound: 'Purr',
                title: "Stylus Error:",
                message: "<%= error.message %>"
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [
                // axis(), jeet(), rupture(),
                autoprefixer('> 1%', 'last 2 versions', 'Android >= 4')
            ],
            compress: true,
            linenos: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinations.styles))
        .pipe(connect.reload());
});

//
// Javascript tasks
//
gulp.task('scripts', function () {
    return gulp.src(sources.js)
        .pipe(jshint({ esversion: 6 })
            .on('error', gutil.beep))
        .pipe(jshint.reporter(stylish))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinations.js))
        // .pipe(uglify())
        // .pipe(gulp.dest(destinations.js))
        .pipe(connect.reload());
});

gulp.task('vendorjs', function () {
    return gulp.src(sources.vendorjs)
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        // .pipe(gulp.dest(destinations.js))
        // .pipe(uglify())
        .pipe(gulp.dest(destinations.js));
});

gulp.task('html', function () {
    gulp.src(sources.html)
        .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
    gulp.watch(sources.stylus, ['stylus']);
    gulp.watch(sources.html, ['html']);
    gulp.watch(sources.js, ['scripts']);
    gulp.watch(sources.vendorjs, ['vendorjs']);
});

gulp.task('server', ['watch'], function () {
    connect.server({
        port: 8888,
        root: 'public',
        livereload: true
    });
});

gulp.task('build', ['stylus', 'scripts', 'vendorjs']);

gulp.task('default', ['build']);

