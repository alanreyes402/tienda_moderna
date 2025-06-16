import * as marcasRepositorio from './marcas.repositorio.js';

export const obtenerMarcas = () => marcasRepositorio.obtenerMarcas();

export const obtenerMarcaPorId = (id) => marcasRepositorio.obtenerMarcaPorId(id);

export const crearMarca = (datos) => {
    if (!datos.Nombre_marca) {
        throw new Error('El campo Nombre_marca es obligatorio');
    }
    return marcasRepositorio.crearMarca(datos);
};

export const actualizarMarca = (id, datos) => {
    if (!datos.Nombre_marca) {
        throw new Error('El campo Nombre_marca es obligatorio');
    }
    return marcasRepositorio.actualizarMarca(id, datos);
};

export const eliminarMarca = (id) => marcasRepositorio.eliminarMarca(id);
