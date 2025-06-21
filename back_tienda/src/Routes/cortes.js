/**
 * TIENDA_MODERNA/src/Routes/cortes.js
 * Descripción:
 * Contiene la ruta para realizar la operación de corte de caja diario.
 */

import express from 'express';
import { sql, pool } from '../BD/MySQL.js'; // ← CORREGIDO

const router = express.Router();

// --- REALIZAR CORTE DE CAJA ---
/**
 * @route   POST /api/cortes
 * @desc    Registra un nuevo corte de caja en la bitácora.
 * @access  Public
 * @body    { "nombre_corte": "NombreDelCajero" }
 * @uses    SP: sp_realizar_corte_diario
 */
router.post('/', async (req, res) => {
  const { nombre_corte } = req.body;

  if (!nombre_corte) {
    return res.status(400).json({ error: 'El nombre de quien realiza el corte es requerido.' });
  }

  try {
    const request = await pool.then(p => p.request()); // ← CORREGIDO
    request.input('nombre_corte', sql.VarChar(50), nombre_corte);

    const result = await request.execute('sp_realizar_corte_diario');
    res.status(201).json(result.recordset[0]);
    
  } catch (error) {
    console.error('Error al realizar el corte de caja:', error);
    res.status(500).json({ error: 'Error interno al realizar el corte.' });
  }
});

export default router;
