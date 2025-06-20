/**
 * TIENDA_MODERNA/src/Routes/marcas.js
 * * Descripción:
 * Este archivo contiene las rutas de la API para la gestión de las marcas de productos.
 * Expone endpoints para las operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre la tabla 'marcas'.
 * Toda la lógica de negocio y acceso a datos se realiza directamente contra la base de datos,
 * siguiendo el patrón de un "thin backend".
 */

import express from 'express';
import sql from 'mssql'; // Importante: Se necesita para definir los tipos de datos en las consultas parametrizadas.
import db from '../BD/MySQL.js'; // Tu módulo de conexión a la base de datos

const router = express.Router();

// --- 1. OBTENER TODAS LAS MARCAS ---
// GET /api/marcas
router.get('/', async (req, res) => {
  try {
    const request = db.request();
    const result = await request.query('SELECT * FROM marcas ORDER BY Nombre_marca ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    res.status(500).json({ error: 'Error interno al obtener las marcas' });
  }
});

// --- 2. OBTENER UNA MARCA POR SU ID ---
// GET /api/marcas/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = db.request();
    // Usamos consultas parametrizadas para prevenir inyección SQL
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
// POST /api/marcas
router.post('/', async (req, res) => {
  const { Nombre_marca } = req.body;

  // Validación básica en el backend
  if (!Nombre_marca || Nombre_marca.trim() === '') {
    return res.status(400).json({ error: 'El campo Nombre_marca es requerido.' });
  }

  try {
    const request = db.request();
    request.input('Nombre_marca', sql.VarChar(50), Nombre_marca);

    // Usamos 'OUTPUT Inserted.*' para que SQL Server nos devuelva la fila recién creada
    const result = await request.query('INSERT INTO marcas (Nombre_marca) OUTPUT Inserted.* VALUES (@Nombre_marca)');
    
    // Devolvemos el registro completo con el nuevo ID y un estado 201 (Created)
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear la nueva marca:', error);
    res.status(500).json({ error: 'Error interno al crear la marca.' });
  }
});

// --- 4. ACTUALIZAR UNA MARCA EXISTENTE ---
// PUT /api/marcas/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre_marca } = req.body;

  if (!Nombre_marca || Nombre_marca.trim() === '') {
    return res.status(400).json({ error: 'El campo Nombre_marca es requerido.' });
  }
  
  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);
    request.input('Nombre_marca', sql.VarChar(50), Nombre_marca);
    
    // 'OUTPUT Inserted.*' nos devuelve la fila actualizada
    const result = await request.query('UPDATE marcas SET Nombre_marca = @Nombre_marca OUTPUT Inserted.* WHERE id_marca = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      // Si la consulta no afectó ninguna fila, es porque la marca no existe
      res.status(404).json({ error: 'Marca no encontrada para actualizar.' });
    }
  } catch (error) {
    console.error(`Error al actualizar la marca con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar la marca.' });
  }
});

// --- 5. BORRAR UNA MARCA ---
// DELETE /api/marcas/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = db.request();
    request.input('id', sql.SmallInt, id);

    const result = await request.query('DELETE FROM marcas WHERE id_marca = @id');

    // 'rowsAffected' nos dice cuántas filas se eliminaron
    if (result.rowsAffected[0] > 0) {
      // Éxito, se responde con 204 (No Content) que es el estándar para un DELETE exitoso.
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Marca no encontrada para eliminar.' });
    }
  } catch (error) {
    // Este error suele ocurrir si se intenta borrar una marca que está siendo usada por un producto (foreign key constraint)
    console.error(`Error al borrar la marca con ID ${id}:`, error);
    res.status(500).json({ 
      error: 'Error interno al borrar la marca.',
      message: 'Es posible que esta marca esté asignada a uno o más productos y no pueda ser eliminada.'
    });
  }
});

export default router;