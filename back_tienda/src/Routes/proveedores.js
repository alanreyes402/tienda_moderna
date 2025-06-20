/**
 * TIENDA_MODERNA/src/Routes/proveedores.js
 * * Descripción:
 * Este archivo contiene las rutas de la API para la gestión de los proveedores.
 * Proporciona endpoints para las operaciones CRUD (Crear, Leer, Actualizar, Borrar) 
 * sobre la tabla 'proveedores'.
 */

import express from 'express';
import sql from 'mssql'; // Necesario para consultas parametrizadas
import db from '../BD/MySQL.js'; // Módulo de conexión a BD

const router = express.Router();

// --- 1. OBTENER TODOS LOS PROVEEDORES ---
// GET /api/proveedores
router.get('/', async (req, res) => {
  try {
    const request = db.request();
    const result = await request.query('SELECT * FROM proveedores ORDER BY nombre_prov ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    res.status(500).json({ error: 'Error interno al obtener los proveedores' });
  }
});

// --- 2. OBTENER UN PROVEEDOR POR SU ID ---
// GET /api/proveedores/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);
    const result = await request.query('SELECT * FROM proveedores WHERE id_prov = @id');
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener el proveedor con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el proveedor' });
  }
});

// --- 3. CREAR UN NUEVO PROVEEDOR ---
// POST /api/proveedores
router.post('/', async (req, res) => {
  const { nombre_prov, Numero_prov } = req.body;

  if (!nombre_prov || nombre_prov.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_prov es requerido.' });
  }

  try {
    const request = db.request();
    request.input('nombre_prov', sql.VarChar(100), nombre_prov);
    request.input('Numero_prov', sql.VarChar(10), Numero_prov);

    const result = await request.query(
      'INSERT INTO proveedores (nombre_prov, Numero_prov) OUTPUT Inserted.* VALUES (@nombre_prov, @Numero_prov)'
    );
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear el nuevo proveedor:', error);
    res.status(500).json({ error: 'Error interno al crear el proveedor.' });
  }
});

// --- 4. ACTUALIZAR UN PROVEEDOR EXISTENTE ---
// PUT /api/proveedores/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_prov, Numero_prov } = req.body;

  if (!nombre_prov || nombre_prov.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre_prov es requerido.' });
  }
  
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);
    request.input('nombre_prov', sql.VarChar(100), nombre_prov);
    request.input('Numero_prov', sql.VarChar(10), Numero_prov);
    
    const result = await request.query(
      'UPDATE proveedores SET nombre_prov = @nombre_prov, Numero_prov = @Numero_prov OUTPUT Inserted.* WHERE id_prov = @id'
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado para actualizar.' });
    }
  } catch (error) {
    console.error(`Error al actualizar el proveedor con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar el proveedor.' });
  }
});

// --- 5. BORRAR UN PROVEEDOR ---
// DELETE /api/proveedores/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);

    const result = await request.query('DELETE FROM proveedores WHERE id_prov = @id');

    if (result.rowsAffected[0] > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado para eliminar.' });
    }
  } catch (error) {
    console.error(`Error al borrar el proveedor con ID ${id}:`, error);
    res.status(500).json({ 
      error: 'Error interno al borrar el proveedor.',
      message: 'Es posible que este proveedor esté asignado a uno o más productos y no pueda ser eliminado.'
    });
  }
});

export default router;