import { Router } from 'express';
import * as bitacoraControlador from './bitacora_cortes.controlador.js';

const router = Router();

router.get('/', bitacoraControlador.obtenerCortes);              // GET /api/bitacora_cortes
router.get('/:id', bitacoraControlador.obtenerCortePorId);       // GET /api/bitacora_cortes/:id
router.post('/', bitacoraControlador.crearCorte);                // POST /api/bitacora_cortes
router.put('/:id', bitacoraControlador.actualizarCorte);         // PUT /api/bitacora_cortes/:id
router.delete('/:id', bitacoraControlador.eliminarCorte);        // DELETE /api/bitacora_cortes/:id

export default router;
