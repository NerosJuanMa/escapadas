// 1. SIEMPRE PRIMERO: Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// 2. Importaciones de módulos y rutas
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs'; // Corrección para módulos ESM modernos //Añadido para manejar el sstema de archivos
import viajeRoutes from './routes/viaje.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que la carpeta 'uploads' exista al arrancar el servidor
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

app.get('/test-upload', (req, res) => {
    res.json({
        uploadsDir
    });
});

// 3. CORREGIDO: Servir frontend de forma segura (subiendo un nivel si es necesario)
// Si tu frontend está en una carpeta llamada 'frontend' al lado de 'backend':
app.use(express.static(path.join(__dirname, '../frontend'))); 
// Permite acceder a las imágenes subidas desde el navegador web (ej: http://localhost:3000/uploads/foto.jpg)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(uploadsDir));
// app.use(express.static(path.join(__dirname,'./uploads')));
// app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/uploads', express.static(uploadsDir));
// Rutas de la API
app.use('/api/viajes', viajeRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor de Escapadas corriendo en http://localhost:${PORT}`);
    console.log('SERVER __dirname:', __dirname);
    console.log('UPLOADS DIR:', uploadsDir);
    console.log('STATIC DIR:', path.resolve('uploads'));
});
