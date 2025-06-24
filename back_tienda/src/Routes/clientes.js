import express from 'express';
import { sql, pool } from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS CLIENTES ---
router.get('/', async (req, res) => {
  try {
    const request = await pool.then(p => p.request());
    const result = await request.query('SELECT * FROM clientes ORDER BY nombre_cli ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error interno al obtener los clientes' });
  }
});

// --- 2. OBTENER UN CLIENTE POR SU ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    const result = await request.query('SELECT * FROM clientes WHERE id_cli = @id');
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener el cliente con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el cliente' });
  }
});

// --- 3. CREAR UN NUEVO CLIENTE ---
router.post('/', async (req, res) => {
  const clienteJson = JSON.stringify(req.body); // recibe el mismo JSON que ya envía el front

  if (!req.body.nombre_cli || req.body.nombre_cli.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_cli es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('json', sql.NVarChar(sql.MAX), clienteJson);

    const result = await request.execute('sp_insertar_cliente_json');

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al crear el cliente:', error);
    res.status(500).json({ error: 'Error interno al crear el cliente.' });
  }
});


// --- 4. ACTUALIZAR UN CLIENTE EXISTENTE ---
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const clienteJson = JSON.stringify(req.body);

  if (!req.body.nombre_cli || req.body.nombre_cli.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_cli es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    request.input('json', sql.NVarChar(sql.MAX), clienteJson);

    const result = await request.execute('sp_actualizar_cliente_json');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado para actualizar.' });
    }
  } catch (error) {
    console.error(`❌ Error al actualizar cliente con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar el cliente.' });
  }
});


// --- 5. BORRAR UN CLIENTE ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);

    const result = await request.execute('sp_eliminar_cliente_seguro');

    res.status(204).send();
  } catch (error) {
    if (error?.number === 51000 || (error.message && error.message.includes('ventas asociadas'))) {
      return res.status(409).json({
        error: 'No se puede eliminar el cliente porque está asociado a una o más ventas.'
      });
    }

    console.error(`❌ Error al borrar el cliente con ID ${id}:`, error.message);
    res.status(500).json({
      error: 'Error interno al borrar el cliente.',
      message: 'Es posible que esté vinculado con otras entidades.'
    });
  }
});


export default router;
