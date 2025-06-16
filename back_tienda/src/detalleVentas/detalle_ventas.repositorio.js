import db from '../BD/MySQL.js';

const TABLA = 'detalle_ventas';

export const obtenerDetalles = async () => {
    // Incluye nombre del producto para más fácil visualización
    const [rows] = await db.query(
        `SELECT d.*, p.nombre_prod 
         FROM ${TABLA} d 
         JOIN productos p ON d.id_prod_det = p.id_prod`
    );
    return rows;
};

export const obtenerDetallesPorVenta = async (id_venta_det) => {
    const [rows] = await db.query(
        `SELECT d.*, p.nombre_prod 
         FROM ${TABLA} d 
         JOIN productos p ON d.id_prod_det = p.id_prod
         WHERE d.id_venta_det = ?`,
        [id_venta_det]
    );
    return rows;
};

export const crearDetalle = async (datos) => {
    const { id_venta_det, id_prod_det, cantidad_det } = datos;
    await db.query(
        `INSERT INTO ${TABLA} (id_venta_det, id_prod_det, cantidad_det) VALUES (?, ?, ?)`,
        [id_venta_det, id_prod_det, cantidad_det]
    );
    return datos;
};

export const actualizarDetalle = async (datos) => {
    const { id_venta_det, id_prod_det, cantidad_det } = datos;
    await db.query(
        `UPDATE ${TABLA} SET cantidad_det = ? WHERE id_venta_det = ? AND id_prod_det = ?`,
        [cantidad_det, id_venta_det, id_prod_det]
    );
    return datos;
};

export const eliminarDetalle = async (datos) => {
    const { id_venta_det, id_prod_det } = datos;
    await db.query(
        `DELETE FROM ${TABLA} WHERE id_venta_det = ? AND id_prod_det = ?`,
        [id_venta_det, id_prod_det]
    );
};
