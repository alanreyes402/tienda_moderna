// --- BACKEND: ALERTAS.JS ---
import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- RUTA GET GENERAL: productos en alerta + conteos ---
router.get('/', async (req, res) => {
  try {
    const connectionPool = await pool;

    const bajoStockPromise = connectionPool.request().query('SELECT * FROM vista_productos_bajo_stock');
    const porCaducarPromise = connectionPool.request().query('SELECT * FROM vista_productos_por_caducar');
    const caducadosPromise = connectionPool.request().query('SELECT * FROM vista_productos_caducados');
    const conteoBajoStockPromise = connectionPool.request().query('SELECT COUNT(*) AS productos_bajo_stock FROM vista_productos_bajo_stock');
    const conteoPorCaducarPromise = connectionPool.request().query('SELECT COUNT(*) AS productos_por_caducar FROM vista_productos_por_caducar');

    const [
      resultadoBajoStock,
      resultadoPorCaducar,
      resultadoCaducados,
      conteoBajoStock,
      conteoPorCaducar
    ] = await Promise.all([
      bajoStockPromise,
      porCaducarPromise,
      caducadosPromise,
      conteoBajoStockPromise,
      conteoPorCaducarPromise
    ]);

    res.json({
      bajo_stock: resultadoBajoStock.recordset,
      por_caducar: resultadoPorCaducar.recordset,
      caducados: resultadoCaducados.recordset,
      conteos: {
        productos_bajo_stock: conteoBajoStock.recordset[0]?.productos_bajo_stock ?? 0,
        productos_por_caducar: conteoPorCaducar.recordset[0]?.productos_por_caducar ?? 0
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener alertas y conteos:', error);
    res.status(500).json({ error: 'Error al obtener productos en alerta y conteos.' });
  }
});


export default router;
