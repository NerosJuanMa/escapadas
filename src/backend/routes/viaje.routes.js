import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
// Importa tus controladores (ajusta el path de tu proyecto si difiere)
import { obtenerTodos, crear, actualizar, borrar } from '../controllers/viaje.controller.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar cómo y dónde se guardan los archivos físicos en el disco duro
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Guarda los archivos dentro de backend/uploads/
//         cb(null, path.join(__dirname, '../uploads')); 
//     },
//     filename: (req, file, cb) => {
//         // Renombrar archivo agregando un timestamp único para evitar duplicados en el disco
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });
const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({

    destination(req, file, cb) {
        // cb(null, 'uploads/');
        // cb(null, path.join(__dirname, '../uploads'));
        cb(null, uploadDir);
    },

    filename(req, file, cb) {

        const extension =
            path.extname(file.originalname);

        const nombre =
            `${Date.now()}${extension}`;

        cb(null, nombre);
    }
    
});
console.log('UPLOAD DIR:', uploadDir);
export const upload = multer({
    storage
});



// Rutas de la API
router.get('/', obtenerTodos);           // GET /api/viajes -> Obtener todos

// CORREGIDO: 'upload.single' debe ir ANTES del controlador para procesar el archivo primero
router.post('/', upload.single('imagenFile'), crear);                 // POST /api/viajes -> Crear uno nuevo
router.put('/:id', upload.single('imagenFile'), actualizar);          // PUT /api/viajes/:id -> Modificar un viaje completo o estado

router.delete('/:id', borrar);           // DELETE /api/viajes/:id -> Eliminar un viaje

export default router;
