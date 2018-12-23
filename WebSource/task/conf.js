"use strict";
var gutil = require("gulp-util");
exports.paths = {
    src: "./",
    dist: "./dist/",
    tmp: "./.tmp/"
}, exports.server = {
    index: "index.html",
    cache: !1,
    port: 8e3
}, exports.bower = {
    bowerDirectory: "./app/lib",
    bowerrc: ".bowerrc",
    bowerJson: "./bower.json"
}, exports.appFiles = {
    js: ["app/cnfg.js", "app/config.js", "app/application.js", "app/modules/core/*.client.module.js", "app/modules/core/config/*.js", "app/modules/core/filters/*.js", "app/modules/core/services/*.js", "app/modules/core/directives/*.js", "app/modules/core/controllers/*.js", "app/modules/users/*.js", "app/modules/users/*[!tests]*/*.js", "app/modules/*/*.js", "app/modules/**/js/*.js", "app/modules/*[!core]*/config/*.js", "app/modules/*[!core]*/filters/*.js", "app/vendor/**/*js"],
    watchjs: ["app/**/*.js"],
    css: ["app/modules/**/css/*.css", "app/vendor/**/*.css"],
    html: ["app/modules/**/views/**/*.html"],
    index: ["index.html"]
}, exports.wiredep = {}, exports.errorHandler = function(e) {
    return function(s) {
        gutil.log(gutil.colors.red("[" + e + "]"), s.toString())
    }
};
