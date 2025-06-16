import db from '../BD/MySQL.js';

const TABLA = 'bitacora_cortes';

export const obtenerCortes = async () => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA}`);
    return rows;
};

export const obtenerCortePorId = async (id) => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA} WHERE id_corte = ?`, [id]);
    return rows[0];
};

export const crearCorte = async (datos) => {
    const { monto_corte, fecha_corte, nombre_corte } = datos;
    const [result] = await db.query(
        `INSERT INTO ${TABLA} (monto_corte, fecha_corte, nombre_corte) VALUES (?, ?, ?)`,
        [monto_corte, fecha_corte, nombre_corte]
    );
    return { id_corte: result.insertId, monto_corte, fecha_corte, nombre_corte };
};

export const actualizarCorte = async (id, datos) => {
    const { monto_corte, fecha_corte, nombre_corte } = datos;
    await db.query(
        `UPDATE ${TABLA} SET monto_corte = ?, fecha_corte = ?, nombre_corte = ? WHERE id_corte = ?`,
        [monto_corte, fecha_corte, nombre_corte, id]
    );
    return { id_corte: id, monto_corte, fecha_corte, nombre_corte };
};

export const eliminarCorte = async (id) => {
    await db.query(`DELETE FROM ${TABLA} WHERE id_corte = ?`, [id]);
};
