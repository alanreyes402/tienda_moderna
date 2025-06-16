import { Router } from 'express';
import * as productosControlador from './productos.controlador.js';

const router = Router();

router.get('/', productosControlador.obtenerProductos);           // GET /api/productos
router.get('/:id', productosControlador.obtenerProductoPorId);    // GET /api/productos/:id
router.post('/', productosControlador.crearProducto);             // POST /api/productos
router.put('/:id', productosControlador.actualizarProducto);      // PUT /api/productos/:id
router.delete('/:id', productosControlador.eliminarProducto);     // DELETE /api/productos/:id

export default router;
