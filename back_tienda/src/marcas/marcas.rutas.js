import { Router } from 'express';
import * as marcasControlador from './marcas.controlador.js';

const router = Router();

router.get('/', marcasControlador.obtenerMarcas);           // GET /api/marcas
router.get('/:id', marcasControlador.obtenerMarcaPorId);    // GET /api/marcas/:id
router.post('/', marcasControlador.crearMarca);             // POST /api/marcas
router.put('/:id', marcasControlador.actualizarMarca);      // PUT /api/marcas/:id
router.delete('/:id', marcasControlador.eliminarMarca);     // DELETE /api/marcas/:id

export default router;
