"use strict";var gulp=require("gulp"),conf=require("./conf"),clear=require("clear"),runSequence=require("run-sequence");gulp.task("dist",function(){clear(),runSequence(["clean","clean:dist","clean:dist:app"],["dist-js","dist-css"],"inject:production","assets",["copy-fonts-awesome","copy-fonts","copy-fonts-gly"],"absolute-path-compress","html:remove:livereload",["clean:dist:app","clean"])});