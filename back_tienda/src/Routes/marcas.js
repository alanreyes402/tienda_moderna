import express from 'express';
import { sql, pool } from '../BD/MySQL.js'; // ← CAMBIO AQUÍ

const router = express.Router();

// --- 1. OBTENER TODAS LAS MARCAS ---
router.get('/', async (req, res) => {
  try {
    const request = await pool.then(p => p.request()); // ← CAMBIO
    const result = await request.query('SELECT * FROM marcas ORDER BY Nombre_marca ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    res.status(500).json({ error: 'Error interno al obtener las marcas' });
  }
});

// --- 2. OBTENER UNA MARCA POR SU ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    const result = await request.query('SELECT * FROM marcas WHERE id_marca = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error(`Error al obtener la marca con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener la marca' });
  }
});

// --- 3. CREAR UNA NUEVA MARCA ---
router.post('/', async (req, res) => {
  const { Nombre_marca } = req.body;

  if (!Nombre_marca || Nombre_marca.trim() === '') {
    return res.status(400).json({ error: 'El campo Nombre_marca es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('Nombre_marca', sql.VarChar(50), Nombre_marca);

    const result = await request.query(
      'INSERT INTO marcas (Nombre_marca) OUTPUT Inserted.* VALUES (@Nombre_marca)'
    );

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear la nueva marca:', error);
    res.status(500).json({ error: 'Error interno al crear la marca.' });
  }
});

// --- 4. ACTUALIZAR UNA MARCA EXISTENTE ---
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre_marca } = req.body;

  if (!Nombre_marca || Nombre_marca.trim() === '') {
    return res.status(400).json({ error: 'El campo Nombre_marca es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);
    request.input('Nombre_marca', sql.VarChar(50), Nombre_marca);

    const result = await request.query(
      'UPDATE marcas SET Nombre_marca = @Nombre_marca OUTPUT Inserted.* WHERE id_marca = @id'
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Marca no encontrada para actualizar.' });
    }
  } catch (error) {
    console.error(`Error al actualizar la marca con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar la marca.' });
  }
});

// --- 5. BORRAR UNA MARCA ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pool.then(p => p.request());
    request.input('id', sql.SmallInt, id);

    const result = await request.query('DELETE FROM marcas WHERE id_marca = @id');

    if (result.rowsAffected[0] > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Marca no encontrada para eliminar.' });
    }
  } catch (error) {
    console.error(`Error al borrar la marca con ID ${id}:`, error);
    res.status(500).json({
      error: 'Error interno al borrar la marca.',
      message: 'Es posible que esta marca esté asignada a uno o más productos y no pueda ser eliminada.'
    });
  }
});

export default router;
