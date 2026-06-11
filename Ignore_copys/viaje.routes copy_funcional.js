import { Router } from 'express';
import { obtenerTodos, crear, actualizar, borrar } from '../controllers/viaje.controller.js';

const router = Router();

router.get('/', obtenerTodos);           // GET /api/viajes -> Obtener todos
router.post('/', crear);                 // POST /api/viajes -> Crear uno nuevo
router.put('/:id', actualizar);          // PUT /api/viajes/:id -> Modificar un viaje completo o estado
router.delete('/:id', borrar);           // DELETE /api/viajes/:id -> Eliminar un viaje

export default router;
