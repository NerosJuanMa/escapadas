import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = 3000;

// Configuración de rutas absolutas para la estructura src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// El JSON está en la misma carpeta que este script (src/backend/viajes.json)
const FILE_PATH = path.join(__dirname, 'viajes.json');

// El frontend está subiendo un nivel y entrando en 'frontend' (src/frontend/)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Leer archivo JSON
const leerViajes = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Guardar en archivo JSON
const guardarViajes = (viajes) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(viajes, null, 2), 'utf-8');
};

// --- API ENDPOINTS ---

// GET: Obtener todos los viajes
app.get('/api/viajes', (req, res) => {
    const viajes = leerViajes();
    res.json(viajes);
});

// GET (Simulado para crear): Recibe parámetros por URL query
app.get('/api/viajes/crear', (req, res) => {
    const { titulo, descripcion, categoria, pais, imagenUrl } = req.query;
    
    if (!titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const viajes = leerViajes();
    const maxId = viajes.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
    const nuevoViaje = {
        id: maxId + 1,
        titulo,
        descripcion: descripcion || '',
        categoria: categoria || 'Playa/Mar',
        pais: pais || 'No especificado',
        imagenUrl: imagenUrl || 'https://unsplash.com',
        estado: 'Pendiente'
    };

    viajes.push(nuevoViaje);
    guardarViajes(viajes);
    
    res.json({ mensaje: 'Viaje creado con éxito', viaje: nuevoViaje });
});

// GET (Simulado para actualizar): Cambiar el estado de un viaje
app.get('/api/viajes/actualizar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { estado } = req.query;

    let viajes = leerViajes();
    let modificado = false;

    viajes = viajes.map(viaje => {
        if (viaje.id === id) {
            modificado = true;
            return { ...viaje, estado: estado || viaje.estado };
        }
        return viaje;
    });

    if (!modificado) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    guardarViajes(viajes);
    res.json({ mensaje: 'Estado actualizado correctamente' });
});

// GET (Simulado para borrar): Eliminar un viaje
app.get('/api/viajes/borrar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let viajes = leerViajes();
    
    const longitudInicial = viajes.length;
    viajes = viajes.filter(viaje => viaje.id !== id);

    if (viajes.length === longitudInicial) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    guardarViajes(viajes);
    res.json({ mensaje: 'Viaje eliminado con éxito' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de Escapadas corriendo en http://localhost:${PORT}`);
});
