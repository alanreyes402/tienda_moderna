import { Router } from 'express';
import * as detalleControlador from './detalle_ventas.controlador.js';

const router = Router();

router.get('/', detalleControlador.obtenerDetalles);             // GET /api/detalle_ventas
router.get('/venta/:id', detalleControlador.obtenerDetallesPorVenta); // GET /api/detalle_ventas/venta/:id
router.post('/', detalleControlador.crearDetalle);               // POST /api/detalle_ventas
router.put('/', detalleControlador.actualizarDetalle);           // PUT /api/detalle_ventas (identificado por id_venta_det y id_prod_det)
router.delete('/', detalleControlador.eliminarDetalle);          // DELETE /api/detalle_ventas (identificado por id_venta_det y id_prod_det)

export default router;
