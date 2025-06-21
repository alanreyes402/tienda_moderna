import express from 'express';
import sql from 'mssql';
import db from '../BD/MySQL.js'; // ajusta según tu estructura

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    nombre_prod,
    stock_prod,
    precio_ven_prod,
    precio_com_prod,
    fecha_cad_prod,
    id_prov_prod,
    id_marca_prod
  } = req.body;

  console.log('📥 BODY recibido:', req.body); // 👈 Depuración útil

  // Validación básica
  if (!nombre_prod || stock_prod == null || precio_ven_prod == null || precio_com_prod == null) {
    return res.status(400).json({ error: 'Los campos nombre, stock y precios son requeridos.' });
  }

  try {
    const request = db.request();
    request.input('nombre_prod', sql.VarChar(100), nombre_prod);
    request.input('stock_prod', sql.Int, parseInt(stock_prod));
    request.input('precio_ven_prod', sql.Decimal(10, 2), parseFloat(precio_ven_prod));
    request.input('precio_com_prod', sql.Decimal(10, 2), parseFloat(precio_com_prod));
    request.input('fecha_cad_prod', sql.Date, fecha_cad_prod ? new Date(fecha_cad_prod) : null);
    request.input('id_prov_prod', sql.SmallInt, id_prov_prod ? parseInt(id_prov_prod) : null);
    request.input('id_marca_prod', sql.SmallInt, id_marca_prod ? parseInt(id_marca_prod) : null);

    const query = `
      INSERT INTO productos (
        nombre_prod, stock_prod, precio_ven_prod, precio_com_prod,
        fecha_cad_prod, id_prov_prod, id_marca_prod
      )
      OUTPUT Inserted.*
      VALUES (
        @nombre_prod, @stock_prod, @precio_ven_prod, @precio_com_prod,
        @fecha_cad_prod, @id_prov_prod, @id_marca_prod
      )
    `;

    const result = await request.query(query);
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error SQL al crear producto:', error);
    res.status(500).json({ error: error.message }); // 👈 Te devuelve el error real
  }
});

export default router;