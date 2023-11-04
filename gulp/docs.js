const gulp = require('gulp');

// HTML
const panini = require('panini');
const htmlclean = require('gulp-htmlclean');
const webpHtml = require('gulp-webp-html')

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer  = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourseMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify')
const babel = require('gulp-babel');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const changed = require('gulp-changed');

gulp.task('clean:docs', function(done) {
    if (fs.existsSync('docs/')) {
        return gulp.src('docs/', { read: false }).pipe(clean({ force: true }))
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

gulp.task('html:docs', function() {
    return gulp
        .src('./src/html/*.html')
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(panini({
            root: 'src/html/', // Корневая директория с шаблонами
            layouts: 'src/html/layouts/', // Директория с макетами страниц
            partials: 'src/html/partials/', // Директория с частичными шаблонами
            data: 'src/html/data/', // Директория с данными для шаблонов
          }))
        .pipe(webpHtml())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});

gulp.task('sass:docs', function() {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourseMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourseMaps.write())
        .pipe(gulp.dest('./docs/css/'))
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

gulp.task('images:docs', function() {
    return gulp
        .src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest('./docs/img/'))
});

gulp.task('fonts:docs', function() {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(gulp.dest('./docs/fonts/'))
})

gulp.task('libs:docs', function() {
    return gulp
        .src('./src/libs/**/*')
        .pipe(gulp.dest('./docs/libs/'))
})

gulp.task('js:docs', function() {
    return gulp
        .src('src/js/*.js')
        .pipe(changed('./docs/js'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./docs/js'))
});

const serverOptions = {
    livereload: true,
    open: true
};

gulp.task('server:docs', function() {
    return gulp.src('docs/')
        .pipe(server(serverOptions))
});