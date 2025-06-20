/**
 * TIENDA_MODERNA/src/Routes/ventas.js
 * * Descripción:
 * Contiene las rutas para el flujo de trabajo de una venta.
 * Orquesta llamadas a procedimientos almacenados para verificar y registrar transacciones.
 */

import express from 'express';
import sql from 'mssql';
import db from '../BD/MySQL.js';

const router = express.Router();

// --- 1. VERIFICAR STOCK DE UN PRODUCTO ---
/**
 * @route   POST /api/ventas/verificar-stock
 * @desc    Verifica si la cantidad solicitada de un producto está disponible.
 * @access  Public
 * @body    { "id_prod": number, "cantidad": number }
 * @uses    SP: sp_verificar_stock
 */
router.post('/verificar-stock', async (req, res) => {
  const { id_prod, cantidad } = req.body;

  if (!id_prod || !cantidad) {
    return res.status(400).json({ error: 'Se requiere id_prod y cantidad.' });
  }

  try {
    const request = db.request();
    request.input('id_prod', sql.SmallInt, id_prod);
    request.input('cantidad', sql.Int, cantidad);
    request.output('resultado', sql.Int); // Parámetro de salida

    const result = await request.execute('sp_verificar_stock');
    const resultadoSP = result.output.resultado;

    if (resultadoSP === 1) {
      res.json({ status: 'ok', message: 'Stock suficiente.' });
    } else if (resultadoSP === 0) {
      res.status(409).json({ status: 'insufficient_stock', message: 'Stock insuficiente para realizar la venta.' }); // 409 Conflict
    } else if (resultadoSP === -1) {
      res.status(404).json({ status: 'not_found', message: 'Producto no encontrado.' });
    }

  } catch (error) {
    console.error('Error al verificar stock:', error);
    res.status(500).json({ error: 'Error interno al verificar el stock.' });
  }
});


// --- 2. VERIFICAR TOTAL DE LA VENTA ---
/**
 * @route   POST /api/ventas/verificar-total
 * @desc    Valida que el total de la venta del frontend coincida con los precios de la BD.
 * @access  Public
 * @body    { "items": [{ "id_prod": 1, "cantidad": 2 }], "total_frontend": 150.50 }
 * @uses    SP: sp_VerificarTotalVenta
 */
router.post('/verificar-total', async (req, res) => {
    const { items, total_frontend } = req.body;

    if (!items || !total_frontend) {
        return res.status(400).json({ error: 'Se requieren los items y el total_frontend.'});
    }

    try {
        const request = db.request();
        // El SP espera un string JSON
        request.input('items_json', sql.NVarChar(sql.MAX), JSON.stringify(items));
        request.input('total_frontend', sql.Decimal(10, 2), total_frontend);

        const result = await request.execute('sp_VerificarTotalVenta');

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Error al verificar el total de la venta:', error);
        res.status(500).json({ error: 'Error interno al verificar el total.' });
    }
});


// --- 3. REGISTRAR UNA VENTA COMPLETA ---
/**
 * @route   POST /api/ventas
 * @desc    Inserta la venta y sus detalles en la base de datos.
 * @access  Public
 * @body    { "id_cli_venta": 1 | null, "metodo_pago_venta": "EFECTIVO", "items": [...], "total_venta": 150.50 }
 * @uses    SP: sp_InsertarVentaCompleta -> TRIGGER: trg_actualizar_stock
 */
router.post('/', async (req, res) => {
  const { id_cli_venta, metodo_pago_venta, items, total_venta } = req.body;

  if (!metodo_pago_venta || !items || !total_venta) {
    return res.status(400).json({ error: 'Faltan campos requeridos para la venta.' });
  }

  try {
    const request = db.request();
    request.input('id_cli_venta', sql.SmallInt, id_cli_venta); // Puede ser NULL
    request.input('metodo_pago_venta', sql.VarChar(10), metodo_pago_venta);
    request.input('items_json', sql.NVarChar(sql.MAX), JSON.stringify(items));
    request.input('total_venta', sql.Decimal(10, 2), total_venta);

    const result = await request.execute('sp_InsertarVentaCompleta');

    const resultadoSP = result.recordset[0];
    if(resultadoSP.status === 'success') {
        res.status(201).json(resultadoSP); // 201 Created
    } else {
        // El SP manejó la transacción y hizo ROLLBACK, así que devolvemos el error que nos da
        res.status(500).json({ error: 'No se pudo registrar la venta.', message: resultadoSP.message });
    }

  } catch (error) {
    console.error('Error al registrar la venta completa:', error);
    res.status(500).json({ error: 'Error de servidor al registrar la venta.' });
  }
});


// --- 4. OBTENER DATOS PARA EL TICKET DE VENTA ---
/**
 * @route   GET /api/ventas/ticket/:id
 * @desc    Obtiene todos los datos necesarios para imprimir un ticket de una venta específica.
 * @access  Public
 * @uses    VIEW: vista_detalle_venta_productos
 */
router.get('/ticket/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // NOTA: El SP 'sp_imprimir_ticket_venta' usa PRINT, por lo que no es útil para una API.
        // En su lugar, obtenemos los datos como JSON para que el frontend los pueda renderizar.
        const saleInfoRequest = db.request();
        saleInfoRequest.input('id', sql.SmallInt, id);
        const saleInfoQuery = `
            SELECT v.id_venta, v.fecha_venta, v.total_venta, v.metodo_pago_venta, c.nombre_cli, c.dir_cli
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cli_venta = c.id_cli
            WHERE v.id_venta = @id
        `;
        
        const detailsRequest = db.request();
        detailsRequest.input('id', sql.SmallInt, id);
        const detailsQuery = 'SELECT nombre_prod, cantidad_det, total_por_producto FROM vista_detalle_venta_productos WHERE id_venta = @id';

        // Ejecutamos ambas consultas en paralelo
        const [saleInfoResult, detailsResult] = await Promise.all([
            saleInfoRequest.query(saleInfoQuery),
            detailsRequest.query(detailsQuery)
        ]);

        if (saleInfoResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }

        const ticketData = {
            infoVenta: saleInfoResult.recordset[0],
            detalles: detailsResult.recordset
        };

        res.json(ticketData);

    } catch (error) {
        console.error(`Error al obtener datos del ticket para la venta ${id}:`, error);
        res.status(500).json({ error: 'Error interno al obtener los datos del ticket.' });
    }
});


export default router;