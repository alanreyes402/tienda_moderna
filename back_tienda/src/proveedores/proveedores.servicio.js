import * as proveedoresRepositorio from './proveedores.repositorio.js';

export const obtenerProveedores = () => proveedoresRepositorio.obtenerProveedores();

export const obtenerProveedorPorId = (id) => proveedoresRepositorio.obtenerProveedorPorId(id);

export const crearProveedor = (datos) => {
    // Regla de negocio: El nombre del proveedor es obligatorio.
    if (!datos.nombre_prov) {
        throw new Error('El campo nombre_prov es obligatorio');
    }
    // El Numero_prov es opcional, así que no necesita validación aquí.
    return proveedoresRepositorio.crearProveedor(datos);
};

export const actualizarProveedor = (id, datos) => {
    if (!datos.nombre_prov) {
        throw new Error('El campo nombre_prov es obligatorio');
    }
    return proveedoresRepositorio.actualizarProveedor(id, datos);
};

export const eliminarProveedor = (id) => proveedoresRepositorio.eliminarProveedor(id);