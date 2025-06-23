import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// Buscar productos (por ID o nombre)
router.get('/productos/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const request = (await pool).request();
    request.input('query', sql.VarChar, `%${q}%`);
    const result = await request.query(`
      SELECT id_prod, nombre_prod, precio_ven_prod
      FROM productos
      WHERE CAST(id_prod AS VARCHAR) LIKE @query OR nombre_prod LIKE @query
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos.' });
  }
});

// Buscar clientes (por ID o nombre)
router.get('/clientes/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const request = (await pool).request();
    request.input('query', sql.VarChar, `%${q}%`);
    const result = await request.query(`
      SELECT id_cli, nombre_cli
      FROM clientes
      WHERE CAST(id_cli AS VARCHAR) LIKE @query OR nombre_cli LIKE @query
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    res.status(500).json({ error: 'Error al buscar cliente.' });
  }
});

// Verificar total
router.post('/verificar-total', async (req, res) => {
  const { items, total_frontend } = req.body;
  try {
    const request = (await pool).request();
    request.input('items_json', sql.NVarChar(sql.MAX), JSON.stringify(items));
    request.input('total_frontend', sql.Decimal(10, 2), total_frontend);
    const result = await request.execute('sp_VerificarTotalVenta');
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error en verificación de total:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al verificar el total' });
  }
});

// Crear venta
router.post('/crear', async (req, res) => {
  const { id_cli_venta, metodo_pago_venta, items, total_venta } = req.body;
  try {
    const request = (await pool).request();
    request.input('id_cli_venta', sql.SmallInt, id_cli_venta || null);
    request.input('metodo_pago_venta', sql.VarChar(10), metodo_pago_venta);
    request.input('items_json', sql.NVarChar(sql.MAX), JSON.stringify(items));
    request.input('total_venta', sql.Decimal(10, 2), total_venta);
    const result = await request.execute('sp_InsertarVentaCompleta');
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error interno al registrar venta' });
  }
});

export default router;