var gulp = require('gulp')
    , browserSync = require('browser-sync')
    , sass = require('gulp-sass')
    , reload = browserSync.reload

gulp.task('serve', ['sass'], function() {

    browserSync({
        proxy: "rls.dev"
    })

    gulp.watch("./app/public/css/**/*.scss", ['sass'])
    gulp.watch("./app/views/**/*.html").on('change', reload)
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./app/public/css/*.scss")
        .pipe(sass({
            errLogToConsole: true
            ,includePaths: require('node-neat').includePaths
        }))
        .pipe(gulp.dest("./app/public/css"))
        .pipe(reload({stream: true}))
})

gulp.task('default', ['serve'])
