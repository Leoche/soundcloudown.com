var gulp = require("gulp");
var historyApiFallback = require('connect-history-api-fallback');
var dest = 'dist/';
var browserSync = require('browser-sync').create();
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});
var mainBowerFiles = require('main-bower-files');

var paths = {
  scripts: ['src/js/*'],
  htmls: ['src/*.html'],
  images: 'src/images/**/*',
  styles:'src/css/*',
};

gulp.task('scripts', function() {
	console.log(mainBowerFiles());
	return gulp.src(mainBowerFiles({filter:new RegExp(/.js$/, 'i')}).concat(paths.scripts))
		.pipe(plugins.filter('**/*.js'))
		.pipe(plugins.concat('main.min.js'))
		.pipe(plugins.angularFilesort())
		//.pipe(plugins.uglify())
		.pipe(gulp.dest('dist/js'));
});
gulp.task('css', function() {
	console.log(plugins);
	return gulp.src(paths.styles)
		.pipe(plugins.filter('**/*.sass'))
		.pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
		.pipe(plugins.concat('style.min.css'))
		.pipe(plugins.uglifycss({"uglyComments": true}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});
gulp.task('htmls', function(){
	gulp.src('src/views/*.html')
      .pipe(plugins.htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist/views'));
  return gulp.src(paths.htmls)
      .pipe(plugins.htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
});
gulp.task('images', function(){
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/imgs'));
});
gulp.task('serve', function() {
    browserSync.init({
        server: {
        	baseDir:"./dist",
        	middleware: [historyApiFallback()]
        }
    });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']).on("change", browserSync.reload);
  gulp.watch(paths.styles, ['css']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.htmls, ['htmls']).on("change", browserSync.reload);
  gulp.watch(['src/views/*.html'], ['htmls']).on("change", browserSync.reload);
});
gulp.task("default", ['htmls','css','scripts', 'images','serve','watch']);