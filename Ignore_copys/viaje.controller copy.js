import { leerViajes, guardarViajes } from '../models/viaje.model.js';

// GET: Obtener todos los viajes
export const obtenerTodos = (req, res) => {
    const viajes = leerViajes();
    res.json(viajes);
};

// POST: Recibe datos estructurados en el cuerpo (JSON)
export const crear = (req, res) => {
    // CAMBIO: Ahora los datos se extraen de req.body
    const { titulo, descripcion, categoria, pais, imagenUrl } = req.body;
    
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
    
    // Buenas prácticas: Responder con estado 201 (Creado)
    res.status(201).json({ mensaje: 'Viaje creado con éxito', viaje: nuevoViaje });
};

// PUT: Modifica un recurso existente usando su ID en la URL y los datos en el cuerpo
export const actualizar = (req, res) => {
    const id = parseInt(req.params.id);
    // CAMBIO: El estado ahora viene en el cuerpo de la petición (body)
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: 'El campo estado es obligatorio para actualizar' });
    }

    let viajes = leerViajes();
    let modificado = false;

    viajes = viajes.map(viaje => {
        if (viaje.id === id) {
            modificado = true;
            return { ...viaje, estado: estado };
        }
        return viaje;
    });

    if (!modificado) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    guardarViajes(viajes);
    res.json({ mensaje: 'Estado actualizado correctamente' });
};

// DELETE: Elimina un recurso permanentemente usando su ID
export const borrar = (req, res) => {
    const id = parseInt(req.params.id);
    let viajes = leerViajes();
    
    const longitudInicial = viajes.length;
    viajes = viajes.filter(viaje => viaje.id !== id);

    if (viajes.length === longitudInicial) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    guardarViajes(viajes);
    res.json({ mensaje: 'Viaje eliminado con éxito' });
};
