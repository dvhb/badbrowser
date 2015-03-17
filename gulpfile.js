var gulp = require('gulp'),
    concat = require('gulp-concat'),
    server = require('gulp-webserver');
    
var output = 'badbrowser.js',
    dest = './lib';

var src = [
    './src/vendor/detect/src/detect.js',
    './src/index.js'
];


gulp.task('build', function () {
    return gulp.src(src)
        .pipe(concat(output))
        .pipe(gulp.dest(dest))
});

gulp.task('move', function () {
    return gulp.src(['./src/alerts/**.*'], {base: './src'})
        .pipe(gulp.dest(dest))    
});

gulp.task('server', function () {
    gulp.src('./')
        .pipe(server({
            open: false  
        }))    
});

gulp.task('watch', function () {
    gulp.watch(src, ['build']);    
})

gulp.task('default', ['build', 'move', 'watch', 'server']);