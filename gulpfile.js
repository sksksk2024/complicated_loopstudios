// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss'); // Add Tailwind CSS
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// SCSS Only Task
function scssOnlyTask() {
  return src('app/scss/style.scss')  // 1. Select your source SCSS file
    .pipe(sass().on('error', sass.logError))  // 2. Compile SCSS to CSS, log errors if any
    .pipe(dest('dist'));  // 3. Output compiled CSS to the dist folder
}

exports.scssOnlyTask = scssOnlyTask; // 4. Export the task so it can be run from the terminal

// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      tailwindcss,  // Tailwind CSS processing via PostCSS
      autoprefixer(),
      cssnano()
    ]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

exports.scssTask = scssTask;

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }))
    .pipe(browsersync.stream());
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);