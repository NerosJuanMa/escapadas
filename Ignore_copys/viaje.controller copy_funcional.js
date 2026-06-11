import { leerViajes, guardarViajes } from '../models/viaje.model.js';

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
        estado: req.body.estado || 'Pendiente' // Toma el estado del formulario o 'Pendiente' por defecto
    };

    viajes.push(nuevoViaje);
    guardarViajes(viajes);
    
    res.status(201).json({ mensaje: 'Viaje creado con éxito', viaje: nuevoViaje });
};

// PUT: Modifica un recurso existente actualizando todos sus campos nuevos
export const actualizar = (req, res) => {
    const id = parseInt(req.params.id);
    const viajes = leerViajes();
    let modificado = false;
    let viajeActualizado = null;

    const nuevosViajes = viajes.map(viaje => {
        if (viaje.id === id) {
            modificado = true;
            // CORRECCIÓN: Fusiona los datos antiguos con todo lo nuevo que venga en req.body
            viajeActualizado = {
                ...viaje,
                ...req.body 
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
};

// DELETE: Elimina un recurso permanentemente
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
