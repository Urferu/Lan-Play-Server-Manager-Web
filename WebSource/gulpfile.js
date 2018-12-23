"use strict";
var gulp = require("gulp"),
    fs = require("fs"),
    gutil = require("gulp-util"),
    runSequence = require("run-sequence");
fs.readdirSync("./task").map(function(e) {
    /\.(js)$/i.test(e) && require("./task/" + e)
}), gulp.task("default", function() {
    return gutil.log("Iniciando el servidor de desarrollo"), runSequence("clean", "inject:developer", "serve")
});
