import { leerViajes, guardarViajes } from '../models/viaje.model.js';

export const obtenerTodos = (req, res) => {
    const viajes = leerViajes();
    res.json(viajes);
};

export const crear = (req, res) => {
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
};

export const actualizar = (req, res) => {
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
};

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
