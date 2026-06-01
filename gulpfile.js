import { src, dest, parallel } from "gulp"; 
import babel from "gulp-babel"; 
import concat from 'gulp-concat'; 
import uglify from "gulp-uglify"; 
import cleanCSS from 'gulp-clean-css';

// 1. Optimización de JavaScript 
function jsTransform() { 
    const babelOptions = { presets: ["@babel/preset-env"] };
     return src("src/**/*.js") 
     .pipe(babel(babelOptions)) 
     .pipe(concat("bundle.js")) 
     .pipe(uglify()) 
     .pipe(dest("dist")); 
} 

// 2. Optimización de CSS 
function minifyCss() { 
    return src("src/**/*.css") 
    .pipe(cleanCSS()) 
    .pipe(dest("dist")); 
} 
//3. Copia de archivos backend sin transformación
function backend() {
    return src("src/backend/**/*")
        .pipe(dest("dist/backend"));
}
// 4. Tareas expuestas y tarea por defecto (Ejec. en paralelo) 
export { jsTransform, minifyCss, backend }; 
export default parallel(jsTransform, minifyCss, backend );