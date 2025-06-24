import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS PROVEEDORES ---
router.get('/', async (req, res) => {
  try {
    const request = await pool.then(p => p.request());
    const result = await request.query('SELECT * FROM proveedores ORDER BY nombre_prov ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener los proveedores:', error.message);
    res.status(500).json({ error: 'Error interno al obtener los proveedores' });
  }
});

// --- 2. OBTENER UN PROVEEDOR POR SU ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    const result = await request.query('SELECT * FROM proveedores WHERE id_prov = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    console.error(`❌ Error al obtener el proveedor con ID ${id}:`, error.message);
    res.status(500).json({ error: 'Error interno al obtener el proveedor' });
  }
});

// --- 3. CREAR UN NUEVO PROVEEDOR ---
router.post('/', async (req, res) => {
  const proveedorJson = JSON.stringify(req.body);

  if (!req.body.nombre_prov || req.body.nombre_prov.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_prov es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('json', sql.NVarChar(sql.MAX), proveedorJson);

    const result = await request.execute('sp_insertar_proveedor_json');

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al crear el nuevo proveedor:', error.message);
    res.status(500).json({ error: 'Error interno al crear el proveedor' });
  }
});


// --- 4. ACTUALIZAR UN PROVEEDOR EXISTENTE ---
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const proveedorJson = JSON.stringify(req.body);

  if (!req.body.nombre_prov || req.body.nombre_prov.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_prov es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    request.input('json', sql.NVarChar(sql.MAX), proveedorJson);

    const result = await request.execute('sp_actualizar_proveedor_json');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado para actualizar.' });
    }
  } catch (error) {
    console.error(`❌ Error al actualizar el proveedor con ID ${id}:`, error.message);
    res.status(500).json({ error: 'Error interno al actualizar el proveedor.' });
  }
});


// --- 5. BORRAR UN PROVEEDOR ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);

    await request.execute('sp_eliminar_proveedor_seguro');

    res.status(204).send();
  } catch (error) {
    // Captura error de clave foránea
    if (
      error?.number === 50000 || // THROW personalizado
      error.message.includes('FK_productos_proveedores') || 
      error.message.includes('conflicted with the REFERENCE constraint')
    ) {
      return res.status(409).json({
        error: 'No se puede eliminar el proveedor porque está asociado a uno o más productos.'
      });
    }

    console.error(`❌ Error al borrar el proveedor con ID ${id}:`, error.message);
    res.status(500).json({ error: 'Error interno al borrar el proveedor.' });
  }
});



export default router;
