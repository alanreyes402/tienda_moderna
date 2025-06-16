import db from '../BD/MySQL.js';

const TABLA = 'clientes';

export const obtenerClientes = async () => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA}`);
    return rows;
};

export const obtenerClientePorId = async (id) => {
    const [rows] = await db.query(`SELECT * FROM ${TABLA} WHERE id_cli = ?`, [id]);
    return rows[0];
};

export const crearCliente = async (datos) => {
    const { nombre_cli, Numero_cli, dir_cli } = datos;
    const [result] = await db.query(
        `INSERT INTO ${TABLA} (nombre_cli, Numero_cli, dir_cli) VALUES (?, ?, ?)`,
        [nombre_cli, Numero_cli, dir_cli]
    );
    return { id_cli: result.insertId, nombre_cli, Numero_cli, dir_cli };
};

export const actualizarCliente = async (id, datos) => {
    const { nombre_cli, Numero_cli, dir_cli } = datos;
    await db.query(
        `UPDATE ${TABLA} SET nombre_cli = ?, Numero_cli = ?, dir_cli = ? WHERE id_cli = ?`,
        [nombre_cli, Numero_cli, dir_cli, id]
    );
    return { id_cli: id, nombre_cli, Numero_cli, dir_cli };
};

export const eliminarCliente = async (id) => {
    await db.query(`DELETE FROM ${TABLA} WHERE id_cli = ?`, [id]);
};