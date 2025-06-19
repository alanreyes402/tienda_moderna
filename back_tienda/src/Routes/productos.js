import express from 'express';
import db from '../BD/MySQL.js';

const router = express.Router();

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const result = await db.request().query('SELECT * FROM productos');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/productos/inventario (desde la vista)
router.get('/inventario', async (req, res) => {
  try {
    const result = await db.request().query('SELECT * FROM vista_inventario');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al consultar la vista inventario:', error);
    res.status(500).json({ error: 'Error al consultar la vista' });
  }
});

export default router;