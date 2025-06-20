/**
 * TIENDA_MODERNA/src/Routes/reportes.js
 * * Descripción:
 * Proporciona endpoints para generar reportes. Extrae datos de las vistas
 * y los devuelve en formato JSON para ser consumidos por un cliente.
 */

import express from 'express';
import sql from 'mssql';
import db from '../BD/MySQL.js';

const router = express.Router();

// --- 1. REPORTE DE VENTAS POR FECHA ---
/**
 * @route   POST /api/reportes/ventas
 * @desc    Obtiene un reporte de ventas detallado en un rango de fechas.
 * @access  Public
 * @body    { "fecha_desde": "YYYY-MM-DD", "fecha_hasta": "YYYY-MM-DD" }
 * @uses    VIEW: vista_detalle_venta_productos
 */
router.post('/ventas', async (req, res) => {
    const { fecha_desde, fecha_hasta } = req.body;
    if (!fecha_desde || !fecha_hasta) {
        return res.status(400).json({ error: 'Se requieren fecha_desde y fecha_hasta.' });
    }

    try {
        const request = db.request();
        request.input('fecha_desde', sql.Date, fecha_desde);
        request.input('fecha_hasta', sql.Date, fecha_hasta);

        const query = `
            SELECT * FROM vista_detalle_venta_productos 
            WHERE CAST(fecha_venta AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
            ORDER BY fecha_venta;
        `;
        const result = await request.query(query);
        const detalles = result.recordset;

        // Calculamos los totales en el backend
        const totales = detalles.reduce((acc, item) => {
            acc.total_general += parseFloat(item.total_por_producto);
            acc.ganancia_total += parseFloat(item.total_ganancia);
            return acc;
        }, { total_general: 0, ganancia_total: 0 });

        res.json({ detalles, totales });

    } catch (error) {
        console.error('Error al generar el reporte de ventas:', error);
        res.status(500).json({ error: 'Error interno al generar el reporte.' });
    }
});

// --- 2. REPORTE DE CORTES POR FECHA ---
/**
 * @route   POST /api/reportes/cortes
 * @desc    Obtiene un reporte de cortes de caja en un rango de fechas.
 * @access  Public
 * @body    { "fecha_desde": "YYYY-MM-DD", "fecha_hasta": "YYYY-MM-DD" }
 * @uses    VIEW: vista_detalle_cortes
 */
router.post('/cortes', async (req, res) => {
    const { fecha_desde, fecha_hasta } = req.body;
    if (!fecha_desde || !fecha_hasta) {
        return res.status(400).json({ error: 'Se requieren fecha_desde y fecha_hasta.' });
    }

    try {
        const request = db.request();
        request.input('fecha_desde', sql.Date, fecha_desde);
        request.input('fecha_hasta', sql.Date, fecha_hasta);

        const query = `
            SELECT * FROM vista_detalle_cortes 
            WHERE CAST(fecha_corte AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
            ORDER BY fecha_corte, id_corte, id_venta;
        `;
        const result = await request.query(query);
        
        res.json({ detalles: result.recordset });

    } catch (error) {
        console.error('Error al generar el reporte de cortes:', error);
        res.status(500).json({ error: 'Error interno al generar el reporte.' });
    }
});


// --- 3. REPORTE DE BITÁCORA DE INVENTARIO ---
/**
 * @route   POST /api/reportes/bitacora-inventario
 * @desc    Obtiene los movimientos de inventario en un rango de fechas.
 * @access  Public
 * @body    { "fecha_desde": "YYYY-MM-DD", "fecha_hasta": "YYYY-MM-DD" }
 */
router.post('/bitacora-inventario', async (req, res) => {
    const { fecha_desde, fecha_hasta } = req.body;
    if (!fecha_desde || !fecha_hasta) {
        return res.status(400).json({ error: 'Se requieren fecha_desde y fecha_hasta.' });
    }

    try {
        const request = db.request();
        // El SP esperaba DATETIME, aquí usamos DATE para abarcar todo el día.
        request.input('fecha_desde', sql.Date, fecha_desde);
        request.input('fecha_hasta', sql.Date, fecha_hasta);

        const query = `
            SELECT * FROM bitacora_inventario 
            WHERE CAST(fecha_hora AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
            ORDER BY fecha_hora DESC;
        `;
        const result = await request.query(query);
        
        res.json(result.recordset);

    } catch (error) {
        console.error('Error al generar el reporte de bitácora:', error);
        res.status(500).json({ error: 'Error interno al generar el reporte.' });
    }
});


export default router;