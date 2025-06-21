import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS PRODUCTOS ---
router.get('/', async (req, res) => {
  try {
    const request = (await pool).request();
    const result = await request.query('SELECT * FROM vista_inventario');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
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
    console.error(`Error al obtener el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
});

// --- 3. CREAR UN NUEVO PRODUCTO ---
router.post('/', async (req, res) => {
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
    const request = (await pool).request();
    request.input('nombre_prod', sql.VarChar(100), nombre_prod);
    request.input('precio_ven_prod', sql.Decimal(10, 2), precio_ven_prod);
    request.input('precio_com_prod', sql.Decimal(10, 2), precio_com_prod);
    request.input('stock_prod', sql.Int, stock_prod);
    request.input('id_prov_prod', sql.SmallInt, id_prov_prod || null);
    request.input('id_marca_prod', sql.SmallInt, id_marca_prod || null);
    request.input('fecha_cad_prod', sql.Date, fecha_cad_prod || null);

    const result = await request.query(`
      INSERT INTO productos 
        (nombre_prod, precio_ven_prod, precio_com_prod, stock_prod, id_prov_prod, id_marca_prod, fecha_cad_prod) 
      VALUES 
        (@nombre_prod, @precio_ven_prod, @precio_com_prod, @stock_prod, @id_prov_prod, @id_marca_prod, @fecha_cad_prod)
    `);

    res.status(201).json({ message: 'Producto creado correctamente.' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto.' });
  }
});

// --- 4. ACTUALIZAR PRODUCTO ---
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
    const request = (await pool).request();
    request.input('id', sql.SmallInt, id);
    request.input('nombre_prod', sql.VarChar(100), nombre_prod);
    request.input('precio_ven_prod', sql.Decimal(10, 2), precio_ven_prod);
    request.input('precio_com_prod', sql.Decimal(10, 2), precio_com_prod);
    request.input('stock_prod', sql.Int, stock_prod);
    request.input('id_prov_prod', sql.SmallInt, id_prov_prod || null);
    request.input('id_marca_prod', sql.SmallInt, id_marca_prod || null);
    request.input('fecha_cad_prod', sql.Date, fecha_cad_prod || null);

    const result = await request.query(`
      UPDATE productos SET 
        nombre_prod = @nombre_prod,
        precio_ven_prod = @precio_ven_prod,
        precio_com_prod = @precio_com_prod,
        stock_prod = @stock_prod,
        id_prov_prod = @id_prov_prod,
        id_marca_prod = @id_marca_prod,
        fecha_cad_prod = @fecha_cad_prod
      WHERE id_prod = @id
    `);

    res.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar el producto.' });
  }
});

// --- 5. BORRAR UN PRODUCTO ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID de producto requerido.' });
  }

  try {
    const request = (await pool).request();
    request.input('id', sql.SmallInt, id);

    // Elimina el producto
    const result = await request.query(`
      DELETE FROM productos WHERE id_prod = @id
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o ya eliminado.' });
    }

    res.json({ message: `Producto con ID ${id} eliminado correctamente.` });
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al eliminar el producto.' });
  }
});

export default router;
