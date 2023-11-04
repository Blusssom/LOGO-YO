const gulp = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourseMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');

gulp.task('clean:dev', function(done) {
    if (fs.existsSync('build/')) {
        return gulp.src('build/', { read: false }).pipe(clean({ force: true }))
    }
    done();
});

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
};

function plumberNotify(title) {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    };
};

gulp.task('html:dev', function() {
    panini.refresh();
    return gulp
        .src('./src/html/*.html')
        .pipe(changed('./build/', {hasChanged: changed.compareContents} ))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(panini({
            root: 'src/html/', // Корневая директория с шаблонами
            layouts: 'src/html/layouts/', // Директория с макетами страниц
            partials: 'src/html/partials/', // Директория с частичными шаблонами
            data: 'src/html/data/', // Директория с данными для шаблонов
          }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('sass:dev', function() {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourseMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourseMaps.write())
        .pipe(gulp.dest('./build/css/'))
});

const imageminOptions = [
	imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
	})
];

gulp.task('images:dev', function() {
    return gulp
        .src('./src/img/**/*')
        .pipe(changed('./build/img/'))
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest('./build/img/'))
});

gulp.task('fonts:dev', function() {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(gulp.dest('./build/fonts/'))
})

gulp.task('libs:dev', function() {
    return gulp
        .src('./src/libs/**/*')
        .pipe(gulp.dest('./build/libs/'))
})

gulp.task('js:dev', function() {
    return gulp
        .src('src/js/*.js')
        .pipe(changed('./build/js'))
        .pipe(plumber(plumberNotify('JS')))
        // .pipe(babel())
        .pipe(gulp.dest('./build/js'))
});

const serverOptions = {
    livereload: true,
    open: true
};

gulp.task('server:dev', function() {
    return gulp.src('./build/')
        .pipe(server(serverOptions))
});

gulp.task('watch:dev', function() {
    gulp.watch('./src/html/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('src/img/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('src/img/**/*', gulp.parallel('libs:dev'));
    gulp.watch('src/js/**/*.js', gulp.parallel('js:dev'));
});