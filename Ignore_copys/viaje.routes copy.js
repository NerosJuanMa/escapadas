import { Router } from 'express';
import { obtenerTodos, crear, actualizar, borrar } from '../controllers/viaje.controller.js';

const router = Router();

router.get('/', obtenerTodos);
router.get('/crear', crear);
router.get('/actualizar/:id', actualizar);
router.get('/borrar/:id', borrar);

export default router;
