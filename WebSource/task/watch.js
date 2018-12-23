"use strict";
var gulp = require("gulp"),
    conf = require("./conf"),
    clear = require("clear"),
    livereload = require("gulp-livereload"),
    plumber = require("gulp-plumber"),
    watch = require("gulp-watch"),
    reloadBrowser = function(e) {
        clear(), livereload.changed(e)
    };
gulp.task("watch", function() {
    watch(conf.appFiles.html, reloadBrowser).on("add", function() {
        gulp.start("inject:developer")
    }).on("change", function() {
        gulp.start("rev-html")
    }).on("unlink", function() {
        gulp.start("inject:developer")
    }), watch(conf.appFiles.watchjs, reloadBrowser).on("add", function() {
        gulp.start("inject:developer")
    }).on("change", function() {
        gulp.start("rev-js")
    }).on("unlink", function() {
        gulp.start("inject:developer")
    }), watch(conf.appFiles.css, reloadBrowser).on("add", function() {
        gulp.start("inject:developer")
    }).on("change", function() {}).on("unlink", function() {
        gulp.start("inject:developer")
    })
});
