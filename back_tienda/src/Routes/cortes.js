import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

router.post('/cortes', async (req, res) => {
  const { fecha_desde, fecha_hasta } = req.body;

  if (!fecha_desde || !fecha_hasta) {
    return res.status(400).json({ error: 'Fechas requeridas.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('desde', sql.Date, fecha_desde);
    request.input('hasta', sql.Date, fecha_hasta);

    const result = await request.query(`
      SELECT id_corte, monto_corte, fecha_corte, nombre_corte
      FROM bitacora_cortes
      WHERE CAST(fecha_corte AS DATE) BETWEEN @desde AND @hasta
      ORDER BY fecha_corte DESC
    `);

    const cortes = result.recordset;
    const total_cortes = cortes.reduce((sum, c) => sum + parseFloat(c.monto_corte || 0), 0);

    res.json({ cortes, total_cortes });
  } catch (error) {
    console.error('❌ Error al obtener cortes:', error);
    res.status(500).json({ error: 'Error al obtener los cortes.' });
  }
});

export default router;
