/**
 * TIENDA_MODERNA/src/Routes/clientes.js
 * * Descripción:
 * Este archivo contiene las rutas de la API para la gestión de los clientes.
 * Proporciona endpoints para las operaciones CRUD (Crear, Leer, Actualizar, Borrar) 
 * sobre la tabla 'clientes'.
 */

import express from 'express';
import sql from 'mssql';
import db from '../BD/MySQL.js';

const router = express.Router();

// --- 1. OBTENER TODOS LOS CLIENTES ---
// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const request = db.request();
    const result = await request.query('SELECT * FROM clientes ORDER BY nombre_cli ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error interno al obtener los clientes' });
  }
});

// --- 2. OBTENER UN CLIENTE POR SU ID ---
// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = db.request();
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
// POST /api/clientes
router.post('/', async (req, res) => {
  const { nombre_cli, Numero_cli, dir_cli } = req.body;

  if (!nombre_cli || nombre_cli.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_cli es requerido.' });
  }

  try {
    const request = db.request();
    request.input('nombre_cli', sql.VarChar(100), nombre_cli);
    request.input('Numero_cli', sql.VarChar(100), Numero_cli);
    request.input('dir_cli', sql.VarChar(100), dir_cli);

    const result = await request.query(
      'INSERT INTO clientes (nombre_cli, Numero_cli, dir_cli) OUTPUT Inserted.* VALUES (@nombre_cli, @Numero_cli, @dir_cli)'
    );
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear el nuevo cliente:', error);
    res.status(500).json({ error: 'Error interno al crear el cliente.' });
  }
});

// --- 4. ACTUALIZAR UN CLIENTE EXISTENTE ---
// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_cli, Numero_cli, dir_cli } = req.body;

  if (!nombre_cli || nombre_cli.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_cli es requerido.' });
  }
  
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);
    request.input('nombre_cli', sql.VarChar(100), nombre_cli);
    request.input('Numero_cli', sql.VarChar(100), Numero_cli);
    request.input('dir_cli', sql.VarChar(100), dir_cli);
    
    const result = await request.query(
      'UPDATE clientes SET nombre_cli = @nombre_cli, Numero_cli = @Numero_cli, dir_cli = @dir_cli OUTPUT Inserted.* WHERE id_cli = @id'
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado para actualizar.' });
    }
  } catch (error) {
    console.error(`Error al actualizar el cliente con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar el cliente.' });
  }
});

// --- 5. BORRAR UN CLIENTE ---
// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);

    const result = await request.query('DELETE FROM clientes WHERE id_cli = @id');

    if (result.rowsAffected[0] > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cliente no encontrado para eliminar.' });
    }
  } catch (error) {
    // La FK en la tabla 'ventas' puede causar este error
    console.error(`Error al borrar el cliente con ID ${id}:`, error);
    res.status(500).json({ 
      error: 'Error interno al borrar el cliente.',
      message: 'Es posible que este cliente esté asignado a una o más ventas y no pueda ser eliminado.'
    });
  }
});

export default router;