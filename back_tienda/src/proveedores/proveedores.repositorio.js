import db from '../BD/MySQL.js';

const TABLA = 'proveedores';

export const obtenerProveedores = async () => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA}`);
    return rows;
};

export const obtenerProveedorPorId = async (id) => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA} WHERE id_prov = ?`, [id]);
    return rows[0];
};

export const crearProveedor = async (datos) => {
    const { nombre_prov, Numero_prov } = datos;
    const [result] = await db.query(
        `INSERT INTO ${TABLA} (nombre_prov, Numero_prov) VALUES (?, ?)`,
        [nombre_prov, Numero_prov]
    );
    return { id_prov: result.insertId, nombre_prov, Numero_prov };
};

export const actualizarProveedor = async (id, datos) => {
    const { nombre_prov, Numero_prov } = datos;
    await db.query(
        `UPDATE ${TABLA} SET nombre_prov = ?, Numero_prov = ? WHERE id_prov = ?`,
        [nombre_prov, Numero_prov, id]
    );
    return { id_prov: id, nombre_prov, Numero_prov };
};

export const eliminarProveedor = async (id) => {
    await db.query(`DELETE FROM ${TABLA} WHERE id_prov = ?`, [id]);
};