import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- RUTA GET GENERAL: productos en alerta ---
router.get('/', async (req, res) => {
  try {
    const connectionPool = await pool;
    const bajoStockPromise = connectionPool.request().query('SELECT * FROM vista_productos_bajo_stock');
    const porCaducarPromise = connectionPool.request().query('SELECT * FROM vista_productos_por_caducar');
    const caducadosPromise = connectionPool.request().query('SELECT * FROM vista_productos_caducados');

    const [
      resultadoBajoStock,
      resultadoPorCaducar,
      resultadoCaducados
    ] = await Promise.all([
      bajoStockPromise,
      porCaducarPromise,
      caducadosPromise
    ]);

    res.json({
      bajo_stock: resultadoBajoStock.recordset,
      por_caducar: resultadoPorCaducar.recordset,
      caducados: resultadoCaducados.recordset
    });
  } catch (error) {
    console.error('❌ Error al obtener alertas desde las vistas:', error);
    res.status(500).json({ error: 'Error al obtener productos en alerta.' });
  }
});

// --- NUEVOS ENDPOINTS DE CONTEO DE ALERTAS ---
// Conteo de productos por caducar
router.get('/conteo/por-caducar', async (req, res) => {
  try {
    const result = await (await pool).request().query('SELECT * FROM vista_conteo_productos_por_caducar');
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener conteo por caducar:', error);
    res.status(500).json({ error: 'Error al obtener conteo por caducar.' });
  }
});

// Conteo de productos con bajo stock
router.get('/conteo/bajo-stock', async (req, res) => {
  try {
    const result = await (await pool).request().query('SELECT * FROM vista_conteo_productos_bajo_stock');
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener conteo bajo stock:', error);
    res.status(500).json({ error: 'Error al obtener conteo bajo stock.' });
  }
});

// --- POST: Ejecutar rebaja de precios ---
router.post('/rebajar-precios', async (req, res) => {
  try {
    const connectionPool = await pool;
    await connectionPool.request().execute('sp_rebajar_precio_por_caducar');
    res.status(200).json({ message: 'Precios rebajados correctamente.' });
  } catch (error) {
    console.error('❌ Error al ejecutar rebaja de precios:', error);
    res.status(500).json({ error: 'Error al rebajar precios.' });
  }
});

// --- PUT: Actualizar producto ---
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
    return res.status(400).json({ error: 'Campos requeridos faltantes.' });
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

    await request.query(`
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
    console.error(`❌ Error al actualizar producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar producto.' });
  }
});

// --- DELETE: Eliminar producto ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = (await pool).request();
    request.input('id', sql.SmallInt, id);
    const result = await request.query('DELETE FROM productos WHERE id_prod = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ message: `Producto con ID ${id} eliminado.` });
  } catch (error) {
    console.error(`❌ Error al eliminar producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno al eliminar producto.' });
  }
});

export default router;
