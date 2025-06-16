import { Router } from 'express';
import * as proveedoresControlador from './proveedores.controlador.js';

const router = Router();

router.get('/', proveedoresControlador.obtenerProveedores);    // GET /api/proveedores
router.get('/:id', proveedoresControlador.obtenerProveedorPorId); // GET /api/proveedores/:id
router.post('/', proveedoresControlador.crearProveedor);          // POST /api/proveedores
router.put('/:id', proveedoresControlador.actualizarProveedor);   // PUT /api/proveedores/:id
router.delete('/:id', proveedoresControlador.eliminarProveedor);  // DELETE /api/proveedores/:id

export default router;