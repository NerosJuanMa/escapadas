import { src, dest, parallel } from "gulp";
import babel from "gulp-babel";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";

function jsTransform() {
    return src("src/frontend/js/*.js")
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat("bundle.js"))
        .pipe(uglify())
        .pipe(dest("dist/frontend/js"));
}

function minifyCss() {
    return src("src/frontend/css/*.css")
        .pipe(cleanCSS())
        .pipe(dest("dist/frontend/css"));
}

function html() {
    return src("src/frontend/*.html")
        .pipe(dest("dist/frontend"));
}

function backend() {
    return src("src/backend/**/*")
        .pipe(dest("dist/backend"));
}

export default parallel(
    jsTransform,
    minifyCss,
    html,
    backend
);