import db from '../BD/MySQL.js';

const TABLA = 'ventas';

// Trae la información del cliente también (JOIN LEFT porque puede ser null)
export const obtenerVentas = async () => {
    const [rows] = await db.query(
        `SELECT v.*, c.nombre_cli, c.Numero_cli
         FROM ${TABLA} v
         LEFT JOIN clientes c ON v.id_cli_venta = c.id_cli`
    );
    return rows;
};

export const obtenerVentaPorId = async (id) => {
    const [rows] = await db.query(
        `SELECT v.*, c.nombre_cli, c.Numero_cli
         FROM ${TABLA} v
         LEFT JOIN clientes c ON v.id_cli_venta = c.id_cli
         WHERE v.id_venta = ?`,
        [id]
    );
    return rows[0];
};

export const crearVenta = async (datos) => {
    const { fecha_venta, total_venta, id_cli_venta } = datos;
    const [result] = await db.query(
        `INSERT INTO ${TABLA} (fecha_venta, total_venta, id_cli_venta) VALUES (?, ?, ?)`,
        [fecha_venta, total_venta, id_cli_venta || null]
    );
    return { id_venta: result.insertId, fecha_venta, total_venta, id_cli_venta };
};

export const actualizarVenta = async (id, datos) => {
    const { fecha_venta, total_venta, id_cli_venta } = datos;
    await db.query(
        `UPDATE ${TABLA} SET fecha_venta = ?, total_venta = ?, id_cli_venta = ? WHERE id_venta = ?`,
        [fecha_venta, total_venta, id_cli_venta || null, id]
    );
    return { id_venta: id, fecha_venta, total_venta, id_cli_venta };
};

export const eliminarVenta = async (id) => {
    await db.query(`DELETE FROM ${TABLA} WHERE id_venta = ?`, [id]);
};
