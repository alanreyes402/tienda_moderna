import db from '../BD/MySQL.js';
import * as clientesRepo from '../clientes/clientes.repositorio.js'; // ✅ Corrección aquí

const TABLA = 'ventas';

export const obtenerVentas = async () => {
  const [rows] = await db.query(`SELECT * FROM ${TABLA}`);
  return rows;
};

export const obtenerVentaPorId = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${TABLA} WHERE id_venta = ?`, [id]);
  return rows[0];
};

export const crearVenta = async (datos) => {
  const { id_cli, fecha, total } = datos;

  // Validar que el cliente exista antes de insertar
  const cliente = await clientesRepo.obtenerClientePorId(id_cli);
  if (!cliente) {
    throw new Error(`El cliente con id ${id_cli} no existe`);
  }

  const [result] = await db.query(
    `INSERT INTO ${TABLA} (id_cli, fecha, total) VALUES (?, ?, ?)`,
    [id_cli, fecha, total]
  );

  return { id_venta: result.insertId, id_cli, fecha, total };
};

export const actualizarVenta = async (id, datos) => {
  const { id_cli, fecha, total } = datos;

  const cliente = await clientesRepo.obtenerClientePorId(id_cli);
  if (!cliente) {
    throw new Error(`El cliente con id ${id_cli} no existe`);
  }

  await db.query(
    `UPDATE ${TABLA} SET id_cli = ?, fecha = ?, total = ? WHERE id_venta = ?`,
    [id_cli, fecha, total, id]
  );

  return { id_venta: id, id_cli, fecha, total };
};

export const eliminarVenta = async (id) => {
  await db.query(`DELETE FROM ${TABLA} WHERE id_venta = ?`, [id]);
};