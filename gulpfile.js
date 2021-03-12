// 1. Установка плагина
// 2. Импорт модуля плагина
// 3. Применение модуля плагина в таске

const gulp = require("gulp"); // базовый функционал Gulp
const sass = require("gulp-sass"); // плагин для компиляции Sass
const cleanCSS = require("gulp-clean-css"); // плагин для минификации CSS
const autoprefixer = require("gulp-autoprefixer"); // плагин для добавления вендорных префиксов
const imagemin = require("gulp-imagemin"); // плагин для оптимизации изображений и минификации SVG
const newer = require("gulp-newer"); // плагин который отбрасывает / фильтрует уже существующие файлы в конечной папке
const clean = require("gulp-clean"); // плагин для удаления папок
const htmlmin = require("gulp-htmlmin"); // плагин для минификации HTML

// ======= Функции под различные таски

// компиляции scss, добавление префиксов и минификация css
function sassTask() {
  return gulp
    .src("app/styles/**/*.+(scss|sass)")
    .pipe(sass())
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 10 versions"],
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/styles"));
}

// сжатие изображений, проверка находится ли в конечной папке изображение
function imageTask() {
  return gulp
    .src("app/images/**/*.+(jpeg|jpg|svg|png|gif)")
    .pipe(newer("dist/images"))
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}

// просто копируем файлы шрифтов в папку для продакшна
function copyTask() {
  return gulp
    .src("app/fonts/**/*.+(eot|ttf|woff|woff2)")
    .pipe(gulp.dest("dist/fonts"));
}

// минификация html
function htmlTask() {
  return gulp
    .src("app/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
}

// удаление папки для продакшна
function cleanTask() {
  return gulp
    .src("dist", { allowEmpty: true, read: false })
    .pipe(clean({ force: true }));
}

// запуск нескольких вотчеров, которые отслеживают изменения и выполняют таски автоматом
function watchTask() {
  // Следим за добавлением новых файлов шрифтов
  gulp.watch("app/fonts/**/*.+(eot|ttf|woff|woff2)", copyTask);

  // Следим за изменением изображений
  gulp.watch("app/images/**/*.+(jpeg|jpg|svg|png|gif)", imageTask);

  // Следим за изменением html
  gulp.watch("app/*.html", htmlTask);

  // Следим за изменением стилей
  gulp.watch("app/styles/**/*.+(scss|sass)", sassTask);
}

// ======= Создание тасок

// Старый синтаксис создания таски через gulp.task
gulp.task("sass", sassTask);

gulp.task("img", imageTask);

gulp.task("copy", copyTask);

gulp.task("html", htmlTask);

gulp.task("clean", cleanTask);

// gulp.task("watch", watchTask); // закомментировал, потому что ниже в новом синтаксисе

// Более новый синтаксис создания таски
exports.watch = watchTask; // делает тоже самое что и "gulp.task("watch", watchTask);"

/*
  Основная таска, которая объединяет ранее созданные таски запуская их поочерёдно
  Запускаем командой `gulp build` или `npm start`
  Обратите внимание: данная таска работает только в новом синтаксисе, никаких 
*/
exports.build = gulp.series(
  cleanTask,
  copyTask,
  imageTask,
  sassTask,
  htmlTask,
  watchTask
);
