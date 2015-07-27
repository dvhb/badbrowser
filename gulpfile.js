var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ghPages = require('gulp-gh-pages'),
    server = require('gulp-webserver');
    
var output = 'badbrowser.js',
    dest = './lib';

var src = [
    './src/vendor/detect/detect.js',
    './src/index.js'
];


gulp.task('build', function () {
    gulp.src('./src/style.css')
        .pipe(gulp.dest(dest));

    gulp.src(src)
        .pipe(concat(output))
        .pipe(gulp.dest(dest))
});

gulp.task('move', function () {
    return gulp.src(['./src/alerts/**.*'], {base: './src'})
        .pipe(gulp.dest(dest))    
});

gulp.task('demo', function () {
    return gulp.src(['./src/index.html', './src/demo*.html'])
        .pipe(gulp.dest(dest));    
})

gulp.task('server', function () {
    var host = 'localhost',
        port = 8000;
    gulp.src('./')
        .pipe(server({
            host: host,
            port: port,
            open: 'http://' + host + ':' + port + '/lib/index.html'
        }))    
});

gulp.task('deploy', function () {
    return gulp.src('./lib/**/*')
        .pipe(ghPages({
            remoteUrl: 'git@github.com:dvhbru/dvhb-badbrowser.git'
        }));    
})


gulp.task('watch', function () {
    gulp.watch(src, ['build']);    
})

gulp.task('default', ['build', 'move', 'demo', 'watch', 'server']);