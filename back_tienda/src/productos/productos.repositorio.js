import db from '../BD/MySQL.js';

const TABLA = 'productos';

export const obtenerProductos = async () => {
    // Opcional: Trae la información de marcas y proveedores por JOIN
    const [rows] = await db.query(
        `SELECT p.*, m.Nombre_marca, pr.nombre_prov 
         FROM ${TABLA} p
         JOIN marcas m ON p.id_marca_prod = m.id_marca
         JOIN proveedores pr ON p.id_prov_prod = pr.id_prov`
    );
    return rows;
};

export const obtenerProductoPorId = async (id) => {
    const [rows] = await db.query(
        `SELECT p.*, m.Nombre_marca, pr.nombre_prov 
         FROM ${TABLA} p
         JOIN marcas m ON p.id_marca_prod = m.id_marca
         JOIN proveedores pr ON p.id_prov_prod = pr.id_prov
         WHERE p.id_prod = ?`, 
        [id]
    );
    return rows[0];
};

export const crearProducto = async (datos) => {
    const {
        nombre_prod,
        stock_prod,
        precio_ven_prod,
        precio_com_prod,
        fecha_cad_prod,
        id_prov_prod,
        id_marca_prod
    } = datos;
    const [result] = await db.query(
        `INSERT INTO ${TABLA} (nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod]
    );
    return { id_prod: result.insertId, ...datos };
};

export const actualizarProducto = async (id, datos) => {
    const {
        nombre_prod,
        stock_prod,
        precio_ven_prod,
        precio_com_prod,
        fecha_cad_prod,
        id_prov_prod,
        id_marca_prod
    } = datos;
    await db.query(
        `UPDATE ${TABLA} SET nombre_prod=?, stock_prod=?, precio_ven_prod=?, precio_com_prod=?, fecha_cad_prod=?, id_prov_prod=?, id_marca_prod=? WHERE id_prod=?`,
        [nombre_prod, stock_prod, precio_ven_prod, precio_com_prod, fecha_cad_prod, id_prov_prod, id_marca_prod, id]
    );
    return { id_prod: id, ...datos };
};

export const eliminarProducto = async (id) => {
    await db.query(`DELETE FROM ${TABLA} WHERE id_prod = ?`, [id]);
};
