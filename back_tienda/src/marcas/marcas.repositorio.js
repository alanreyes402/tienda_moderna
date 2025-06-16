import db from '../BD/MySQL.js';

export const obtenerMarcas = async () => {
    const [rows] = await db.query('SELECT * FROM marcas');
    return rows;
};

export const obtenerMarcaPorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM marcas WHERE id_marca = ?', [id]);
    return rows[0];
};

export const crearMarca = async (datos) => {
    const { Nombre_marca } = datos;
    const [result] = await db.query(
        'INSERT INTO marcas (Nombre_marca) VALUES (?)',
        [Nombre_marca]
    );
    return { id_marca: result.insertId, Nombre_marca };
};

export const actualizarMarca = async (id, datos) => {
    const { Nombre_marca } = datos;
    await db.query(
        'UPDATE marcas SET Nombre_marca = ? WHERE id_marca = ?',
        [Nombre_marca, id]
    );
    return { id_marca: id, Nombre_marca };
};

export const eliminarMarca = async (id) => {
    await db.query('DELETE FROM marcas WHERE id_marca = ?', [id]);
};
