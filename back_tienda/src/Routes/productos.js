/*
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

*/

/**
 * TIENDA_MODERNA/src/Routes/productos.js
 * * Descripción:
 * Ruta central para la gestión de productos. Utiliza vistas para consultas
 * enriquecidas y procedimientos almacenados para lógica de negocio específica.
 */

import express from 'express';
import sql from 'mssql';
import db from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS PRODUCTOS (desde la vista) ---
// GET /api/productos
// USA LA VISTA: 'vista_inventario'
router.get('/', async (req, res) => {
  try {
    const request = db.request();
    // En lugar de 'FROM productos', consultamos la vista para obtener datos enriquecidos
    const result = await request.query('SELECT * FROM vista_inventario');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
});

// --- 2. OBTENER UN PRODUCTO POR ID (desde la vista) ---
// GET /api/productos/:id
// USA LA VISTA: 'vista_inventario'
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);
    // Usamos la vista y su alias 'ID_Producto' para la búsqueda
    const result = await request.query('SELECT * FROM vista_inventario WHERE ID_Producto = @id');
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
});

// --- 3. CREAR UN NUEVO PRODUCTO ---
// POST /api/productos
// TRIGGER INVOCADO: 'trg_productos_insert'
router.post('/', async (req, res) => {
  const { nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod } = req.body;

  // Validaciones
  if (!nombre_prod || !stock_prod || !precio_ven_prod || !precio_com_prod) {
    return res.status(400).json({ error: 'Los campos nombre, stock y precios son requeridos.' });
  }

  try {
    const request = db.request();
    request.input('nombre_prod', sql.VarChar(100), nombre_prod);
    request.input('stock_prod', sql.Int, stock_prod);
    request.input('precio_ven_prod', sql.Decimal(10, 2), precio_ven_prod);
    request.input('precio_com_prod', sql.Decimal(10, 2), precio_com_prod);
    request.input('fecha_cad_prod', sql.Date, fecha_cad_prod);
    request.input('id_prov_prod', sql.SmallInt, id_prov_prod);
    request.input('id_marca_prod', sql.SmallInt, id_marca_prod);
    
    const query = `
      INSERT INTO productos (nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod) 
      OUTPUT Inserted.* VALUES (@nombre_prod, @stock_prod, @precio_ven_prod, @precio_com_prod, @fecha_cad_prod, @id_prov_prod, @id_marca_prod)
    `;
    
    const result = await request.query(query);
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto.' });
  }
});

// --- 4. ACTUALIZAR UN PRODUCTO ---
// PUT /api/productos/:id
// TRIGGER INVOCADO: 'trg_productos_update'
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod } = req.body;

    if (!nombre_prod || !stock_prod || !precio_ven_prod || !precio_com_prod) {
        return res.status(400).json({ error: 'Los campos nombre, stock y precios son requeridos.' });
    }

    try {
        const request = db.request();
        request.input('id', sql.SmallInt, id);
        request.input('nombre_prod', sql.VarChar(100), nombre_prod);
        request.input('stock_prod', sql.Int, stock_prod);
        request.input('precio_ven_prod', sql.Decimal(10, 2), precio_ven_prod);
        request.input('precio_com_prod', sql.Decimal(10, 2), precio_com_prod);
        request.input('fecha_cad_prod', sql.Date, fecha_cad_prod);
        request.input('id_prov_prod', sql.SmallInt, id_prov_prod);
        request.input('id_marca_prod', sql.SmallInt, id_marca_prod);

        const query = `
            UPDATE productos 
            SET nombre_prod = @nombre_prod, stock_prod = @stock_prod, precio_ven_prod = @precio_ven_prod, 
                precio_com_prod = @precio_com_prod, fecha_cad_prod = @fecha_cad_prod, 
                id_prov_prod = @id_prov_prod, id_marca_prod = @id_marca_prod 
            OUTPUT Inserted.* WHERE id_prod = @id
        `;
        
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado para actualizar.' });
        }
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${id}:`, error);
        res.status(500).json({ error: 'Error interno al actualizar el producto.' });
    }
});

// --- 5. BORRAR UN PRODUCTO ---
// DELETE /api/productos/:id
// TRIGGER INVOCADO: 'trg_productos_delete'
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);

    const result = await request.query('DELETE FROM productos WHERE id_prod = @id');
    
    if (result.rowsAffected[0] > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Producto no encontrado para eliminar.' });
    }
  } catch (error) {
    console.error(`Error al borrar el producto con ID ${id}:`, error);
    res.status(500).json({ 
      error: 'Error interno al borrar el producto.',
      message: 'Es posible que este producto esté asociado a ventas y no pueda ser eliminado.'
    });
  }
});

// --- RUTAS DE LÓGICA DE NEGOCIO (PROCEDIMIENTOS Y LÓGICA DE BD) ---

// --- 6. BUSCAR PRODUCTOS ---
// GET /api/productos/buscar/:termino
// USA EL PROCEDIMIENTO: 'sp_buscar_producto'
router.get('/buscar/:termino', async (req, res) => {
  const { termino } = req.params;
  try {
    const request = db.request();
    request.input('buscar', sql.VarChar(100), termino);
    const result = await request.execute('sp_buscar_producto');
    res.json(result.recordset);
  } catch (error) {
    console.error(`Error al buscar productos con término "${termino}":`, error);
    res.status(500).json({ error: 'Error interno al buscar productos.' });
  }
});

// --- 7. ALERTA DE STOCK BAJO ---
// GET /api/productos/alertas/stock-bajo
// LÓGICA BASADA EN: 'sp_alerta_stock_bajo'
router.get('/alertas/stock-bajo', async (req, res) => {
  try {
    const request = db.request();
    // NOTA: El SP original 'sp_alerta_stock_bajo' usa PRINT, que no devuelve datos a la API.
    // Se adapta la lógica a una consulta SELECT para que el backend pueda enviar un JSON.
    const result = await request.query('SELECT * FROM productos WHERE stock_prod < 5 ORDER BY stock_prod ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener alerta de stock bajo:', error);
    res.status(500).json({ error: 'Error al obtener alerta de stock bajo.' });
  }
});

// --- 8. ALERTA DE PRODUCTOS PRÓXIMOS A CADUCAR ---
// GET /api/productos/alertas/proximos-a-caducar
// LÓGICA BASADA EN: 'sp_notificar_productos_por_caducar'
router.get('/alertas/proximos-a-caducar', async (req, res) => {
  try {
    const request = db.request();
    // NOTA: El SP original 'sp_notificar_productos_por_caducar' usa PRINT.
    // Se adapta la lógica a una consulta SELECT que devuelve los días restantes.
    const query = `
      SELECT id_prod, nombre_prod, fecha_cad_prod, DATEDIFF(DAY, GETDATE(), fecha_cad_prod) AS dias_restantes 
      FROM productos 
      WHERE fecha_cad_prod IS NOT NULL 
      AND DATEDIFF(DAY, GETDATE(), fecha_cad_prod) BETWEEN 0 AND 7 
      ORDER BY dias_restantes ASC
    `;
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener productos por caducar:', error);
    res.status(500).json({ error: 'Error al obtener productos por caducar.' });
  }
});


export default router;