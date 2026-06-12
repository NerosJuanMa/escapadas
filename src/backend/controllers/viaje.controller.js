import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { leerViajes, guardarViajes } from '../models/viaje.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET: Obtener todos los viajes
export const obtenerTodos = (req, res) => {
    const viajes = leerViajes();
    res.json(viajes);
};

// POST: Crear un nuevo viaje guardando TODOS los campos enviados
export const crear = (req, res) => {
    const { titulo } = req.body;

    if (!titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const viajes = leerViajes();
    const maxId = viajes.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);

    // CORRECCIÓN: El operador '...req.body' extrae automáticamente fecha, calificacion, etc.
    const nuevoViaje = {
        id: maxId + 1,
        ...req.body,
        descripcion: req.body.descripcion || '',
        categoria: req.body.categoria || 'Playa/Mar',
        pais: req.body.pais || 'No especificado',
        imagenUrl: req.body.imagenUrl || 'https://unsplash.com',
        imagenRutaLocal: req.file ? `/uploads/${req.file.filename}` : '',
        // imagenRutaLocal: req.body.imagenRutaLocal || '',   // Guarda la ruta del archivo local del servidor en paralelo
        estado: req.body.estado || 'Pendiente' // Toma el estado del formulario o 'Pendiente' por defecto
    };

    viajes.push(nuevoViaje);
    guardarViajes(viajes);

    res.status(201).json({ mensaje: 'Viaje creado con éxito', viaje: nuevoViaje });
    console.log('FILE:', req.file);
};

// PUT: Modifica un recurso existente actualizando todos sus campos nuevos
export const actualizar = async  (req, res) => {
    const id = parseInt(req.params.id);
    const viajes = leerViajes();
    const indice = viajes.findIndex(
        v => v.id === Number(req.params.id)
        );

        if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Viaje no encontrado'
        });
        }
    const viaje = viajes[indice];
    let modificado = false;
    let viajeActualizado = null;
    let nuevaRuta = viaje.imagenRutaLocal;

    if (req.body.eliminarImagen === 'true') {

    await eliminarArchivo(viaje.imagenRutaLocal);

    nuevaRuta = '';
    }   
    const nuevosViajes = viajes.map(viaje => {
        if (viaje.id === id) {
            modificado = true;

            if (req.file) {

                eliminarArchivo(viaje.imagenRutaLocal);

                nuevaRuta = `/datas/uploads/${req.file.filename}`;
            }
            // CORRECCIÓN: Fusiona los datos antiguos con todo lo nuevo que venga en req.body
            viajeActualizado = {
                ...viaje,
                ...req.body,
                imagenRutaLocal: nuevaRuta
            };
            return viajeActualizado;
        }
        return viaje;
    });

    if (!modificado) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    guardarViajes(nuevosViajes);
    res.json({ mensaje: 'Viaje actualizado correctamente', viaje: viajeActualizado });

    console.log('Imagen actual:', viaje.imagenRutaLocal);
    console.log('Nuevo archivo:', req.file);
    console.log('Body:', req.body);
    console.log('FILE UPDATE:', req.file);
};

// DELETE: Elimina un recurso permanentemente
export const borrar = (req, res) => {
    const id = parseInt(req.params.id);
    let viajes = leerViajes();
    
    const viaje = viajes.find(
    v => v.id === Number(req.params.id)
    );

    if (viaje?.imagenRutaLocal) {
        eliminarArchivo(viaje.imagenRutaLocal);
    }

    const longitudInicial = viajes.length;
    viajes = viajes.filter(viaje => viaje.id !== id);

    if (viajes.length === longitudInicial) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    viajes = viajes.filter(
    v => v.id !== Number(req.params.id)
    );

    guardarViajes(viajes);
    res.json({ mensaje: 'Viaje eliminado con éxito' });
};

// Función auxiliar para borrar imágenes del disco de manera SÍNCRONA (Evita fallos de context)

function eliminarArchivo(rutaImagen) {

    if (!rutaImagen) return;
    // Extrae solo el nombre del archivo de la ruta pública (/uploads/archivo.png -> archivo.png)
    const nombreArchivo = path.basename(rutaImagen);
     // Construye la ruta absoluta hacia backend/datas/uploads/archivo.png
    const rutaCompleta = path.join(__dirname, '..', 'datas', 'uploads', nombreArchivo);

    // const rutaCompleta = path.join(
    //     __dirname,
    //     '..',
    //     rutaImagen.replace(/^\//, '')
    // );

    // try {
    //     await fs.promises.unlink(rutaCompleta);
    // } catch {
    //     // Ignorar si no existe
    // }
    // console.log('Eliminando:', rutaCompleta);
    try {
        if (fs.existsSync(rutaCompleta)) {
            fs.unlinkSync(rutaCompleta);
            console.log('Eliminado con éxito de disco:', rutaCompleta);
        }
    } catch (err) {
        console.error('Error al intentar eliminar el archivo físico:', err);
    }
}