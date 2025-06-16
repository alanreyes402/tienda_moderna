import * as productosRepositorio from './productos.repositorio.js';

export const obtenerProductos = () => productosRepositorio.obtenerProductos();

export const obtenerProductoPorId = (id) => productosRepositorio.obtenerProductoPorId(id);

export const crearProducto = (datos) => {
    // Validaciones principales
    if (!datos.nombre_prod) {
        throw new Error('El campo nombre_prod es obligatorio');
    }
    if (!datos.id_prov_prod) {
        throw new Error('El campo id_prov_prod (proveedor) es obligatorio');
    }
    if (!datos.id_marca_prod) {
        throw new Error('El campo id_marca_prod (marca) es obligatorio');
    }
    if (datos.precio_ven_prod == null || datos.precio_ven_prod < 0) {
        throw new Error('El campo precio_ven_prod es obligatorio y debe ser positivo');
    }
    if (datos.precio_com_prod == null || datos.precio_com_prod < 0) {
        throw new Error('El campo precio_com_prod es obligatorio y debe ser positivo');
    }
    if (datos.stock_prod == null || datos.stock_prod < 0) {
        throw new Error('El campo stock_prod es obligatorio y debe ser positivo');
    }

    // Puedes agregar validaciones adicionales (¿existe la marca/proveedor?)
    return productosRepositorio.crearProducto(datos);
};

export const actualizarProducto = (id, datos) => {
    // Reutiliza las validaciones de arriba si lo deseas
    return productosRepositorio.actualizarProducto(id, datos);
};

export const eliminarProducto = (id) => productosRepositorio.eliminarProducto(id);
