import { Router } from 'express';
import * as ventasControlador from './ventas.controlador.js';

const router = Router();

router.get('/', ventasControlador.obtenerVentas);           // GET /api/ventas
router.get('/:id', ventasControlador.obtenerVentaPorId);    // GET /api/ventas/:id
router.post('/', ventasControlador.crearVenta);             // POST /api/ventas
router.put('/:id', ventasControlador.actualizarVenta);      // PUT /api/ventas/:id
router.delete('/:id', ventasControlador.eliminarVenta);     // DELETE /api/ventas/:id

export default router;
