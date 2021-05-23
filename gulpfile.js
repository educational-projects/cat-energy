const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin")
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "source",
    },
    browser: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
};

exports.default = gulp.series(styles, server, watcher);

// svg-sprite

// sprite
const sprite = "sprite",
  spriteFiles = "source/img/icons/*.svg",
  spritePublic = "source/img/sprite";

gulp.task(sprite, function () {
  return gulp
    .src(spriteFiles)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            prefix: ".icon-%s",
            dimensions: "%s",
            sprite: "../sprite.svg",
            render: {
              scss: {
                dest: "../sprite.scss",
              },
            },
          },
        },
      })
    )
    .pipe(gulp.dest(`source/img/sprite/`))
    .pipe(gulp.dest(spritePublic));
});
