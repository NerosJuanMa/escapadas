import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import viajeRoutes from './routes/viaje.routes.js';

// NUEVO: Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// ACTUALIZADO: Usa el puerto del .env o el 3000 por defecto si no existe
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir frontend (sube un nivel a backend/ y luego a src/)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Registro de rutas con prefijo común
app.use('/api/viajes', viajeRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor de Escapadas corriendo en http://localhost:${PORT}`);
});
