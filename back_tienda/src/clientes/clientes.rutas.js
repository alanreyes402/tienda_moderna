import { Router } from 'express';
import * as clientesControlador from './clientes.controlador.js';

const router = Router();

router.get('/', clientesControlador.obtenerClientes);      // GET /api/clientes
router.get('/:id', clientesControlador.obtenerClientePorId); // GET /api/clientes/:id
router.post('/', clientesControlador.crearCliente);           // POST /api/clientes
router.put('/:id', clientesControlador.actualizarCliente);    // PUT /api/clientes/:id
router.delete('/:id', clientesControlador.eliminarCliente);   // DELETE /api/clientes/:id

export default router;