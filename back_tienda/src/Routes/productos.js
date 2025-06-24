import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS PRODUCTOS ACTIVOS ---
router.get('/', async (req, res) => {
  try {
    const request = (await pool).request();
    const result = await request.query('SELECT * FROM vista_inventario WHERE activo = 1');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error interno al obtener los productos' });
  }
});

// --- 2. OBTENER UN PRODUCTO POR ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = (await pool).request();
    request.input('id', sql.SmallInt, id);
    const result = await request.query('SELECT * FROM productos WHERE id_prod = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(`❌ Error al obtener el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
});

// --- 3. CREAR UN NUEVO PRODUCTO ---
router.post('/', async (req, res) => {
  try {
    const request = (await pool).request();
    request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));

    await request.execute('sp_crear_producto_json');

    res.status(201).json({ message: '✅ Producto creado correctamente.' });
  } catch (error) {
    console.error('❌ Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto.' });
  }
});


// --- 4. ACTUALIZAR PRODUCTO usando procedimiento con JSON ---
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre_prod,
    precio_ven_prod,
    precio_com_prod,
    stock_prod,
    id_prov_prod,
    id_marca_prod,
    fecha_cad_prod
  } = req.body;

  if (!nombre_prod || !precio_ven_prod || !precio_com_prod || !stock_prod) {
    return res.status(400).json({ error: 'Nombre, precios y stock son obligatorios.' });
  }

  try {
    // Construir el objeto en formato JSON esperado por el procedimiento
    const productoJSON = [{
      id_prod: parseInt(id),
      nombre_prod,
      stock_prod,
      precio_ven_prod,
      precio_com_prod,
      fecha_cad_prod: fecha_cad_prod || null,
      id_prov_prod: id_prov_prod || null,
      id_marca_prod: id_marca_prod || null
    }];

    const request = (await pool).request();
    request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(productoJSON));

    await request.execute('sp_guardar_producto_json');

    res.json({ message: `✅ Producto con ID ${id} actualizado correctamente.` });
  } catch (error) {
    console.error(`❌ Error al actualizar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar el producto.' });
  }
});


// --- 5. "ELIMINAR" PRODUCTO (OCULTAR CON ACTIVO = 0) ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID de producto requerido.' });
  }

  try {
    const request = (await pool).request();
    const json = JSON.stringify({ id_prod: parseInt(id) });

    request.input('json', sql.NVarChar(sql.MAX), json);

    await request.execute('sp_ocultar_producto_json');

    res.json({ message: `✅ Producto con ID ${id} ocultado correctamente.` });
  } catch (error) {
    console.error(`❌ Error al ocultar el producto ${id}:`, error.message);

    if (error.message.includes('Producto no encontrado')) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    if (error.message.includes('Producto ya estaba inactivo')) {
      return res.status(400).json({ error: 'Producto ya estaba inactivo.' });
    }

    res.status(500).json({ error: 'Error interno al ocultar el producto.' });
  }
});


export default router;
