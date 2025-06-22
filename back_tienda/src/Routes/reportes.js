import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

/* ------------------------------------------
   POST /reportes/ventas → Reporte por fechas
------------------------------------------- */
router.post('/ventas', async (req, res) => {
  const { fecha_desde, fecha_hasta } = req.body;

  if (!fecha_desde || !fecha_hasta) {
    return res.status(400).json({ error: 'Se requieren fecha_desde y fecha_hasta.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('fecha_desde', sql.Date, fecha_desde);
    request.input('fecha_hasta', sql.Date, fecha_hasta);

    const result = await request.query(`
      SELECT 
        id_venta,
        fecha_venta,
        id_cli_venta,
        nombre_cliente,
        metodo_pago_venta,
        total_venta,
        total_productos,
        ganancia_venta
      FROM vista_ventas_resumen
      WHERE CAST(fecha_venta AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
      ORDER BY fecha_venta DESC;
    `);

    const ventas = result.recordset;
    const total_ventas = ventas.reduce((acc, v) => acc + parseFloat(v.total_venta || 0), 0);
    const total_productos = ventas.reduce((acc, v) => acc + parseFloat(v.total_productos || 0), 0);
    const ganancia_total = ventas.reduce((acc, v) => acc + parseFloat(v.ganancia_venta || 0), 0);

    res.json({ ventas, total_ventas, total_productos, ganancia_total });

  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno al consultar la vista de ventas.' });
  }
});

/* ------------------------------------------
   GET /reportes/ventas → Solo para evitar error por GET
------------------------------------------- */
router.get('/ventas', (req, res) => {
  res.status(405).json({
    error: 'Este endpoint requiere una solicitud POST con fecha_desde y fecha_hasta en el body.'
  });
});

/* ------------------------------------------
   GET /reportes/ticket/:id → Ticket por ID
------------------------------------------- */
router.get('/ticket/:id', async (req, res) => {
  const idVenta = parseInt(req.params.id);

  if (isNaN(idVenta)) {
    return res.status(400).json({ error: 'ID de venta no válido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('id_venta', sql.SmallInt, idVenta);

    const cabecera = await request.query(`
      SELECT v.id_venta, v.fecha_venta, c.nombre_cli AS nombre_cliente, v.metodo_pago_venta, 
             ISNULL(SUM((p.precio_ven_prod - p.precio_com_prod) * dv.cantidad_det), 0) AS ganancia_venta,
             ISNULL(SUM(dv.cantidad_det * p.precio_ven_prod), 0) AS total_venta
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cli_venta = c.id_cli
      LEFT JOIN detalle_ventas dv ON v.id_venta = dv.id_venta_det
      LEFT JOIN productos p ON dv.id_prod_det = p.id_prod
      WHERE v.id_venta = @id_venta
      GROUP BY v.id_venta, v.fecha_venta, c.nombre_cli, v.metodo_pago_venta;
    `);

    const detalle = await request.query(`
      SELECT p.nombre_prod, p.precio_ven_prod, 
             dv.cantidad_det,
             (dv.cantidad_det * p.precio_ven_prod) AS subtotal
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_prod_det = p.id_prod
      WHERE dv.id_venta_det = @id_venta;
    `);

    if (!cabecera.recordset.length) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    res.json({
      venta: cabecera.recordset[0],
      productos: detalle.recordset
    });

  } catch (error) {
    console.error('❌ Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al generar el ticket.' });
  }
});

/* ------------------------------------------
   POST /reportes/cortes → Cortes por fecha
------------------------------------------- */
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

/* ------------------------------------------
   POST /reportes/realizar-corte → Ejecuta SP
------------------------------------------- */
router.post('/realizar-corte', async (req, res) => {
  const { nombre_corte } = req.body;

  if (!nombre_corte) {
    return res.status(400).json({ error: 'El nombre del responsable es obligatorio.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('nombre_corte', sql.VarChar(50), nombre_corte);

    const result = await request.execute('sp_realizar_corte_diario');
    const salida = result.recordset?.[0];

    if (!salida) {
      return res.status(500).json({ error: 'No se recibió respuesta del procedimiento almacenado.' });
    }

    res.json({
      mensaje: salida.mensaje || salida.Mensaje || 'Corte realizado',
      datos: salida
    });

  } catch (error) {
    console.error('❌ Error al ejecutar corte:', error);
    res.status(500).json({ error: 'Error al realizar el corte diario.' });
  }
});
/* ------------------------------------------
   GET /reportes/bitacora-cortes → Ver todos los cortes
------------------------------------------- */
router.get('/bitacora-cortes', async (req, res) => {
  try {
    const request = await pool.then(p => p.request());

    const result = await request.query(`
      SELECT id_corte, monto_corte, fecha_corte, nombre_corte
      FROM bitacora_cortes
      ORDER BY fecha_corte DESC;
    `);

    res.json({ cortes: result.recordset });
  } catch (error) {
    console.error('❌ Error al obtener la bitácora de cortes:', error);
    res.status(500).json({ error: 'Error al consultar la bitácora de cortes.' });
  }
});


export default router;
