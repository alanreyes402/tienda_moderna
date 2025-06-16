import * as detalleRepositorio from './detalle_ventas.repositorio.js';
import * as ventasRepositorio from '../ventas/ventas.repositorio.js';
import * as productosRepositorio from '../productos/productos.repositorio.js';

export const obtenerDetalles = () => detalleRepositorio.obtenerDetalles();

export const obtenerDetallesPorVenta = (id_venta_det) => detalleRepositorio.obtenerDetallesPorVenta(id_venta_det);

export const crearDetalle = async (datos) => {
    if (!datos.id_venta_det || !datos.id_prod_det || !datos.cantidad_det) {
        throw new Error('Faltan campos obligatorios: id_venta_det, id_prod_det, cantidad_det');
    }
    // Validar existencia de venta y producto
    const venta = await ventasRepositorio.obtenerVentaPorId(datos.id_venta_det);
    if (!venta) throw new Error('La venta no existe');
    const producto = await productosRepositorio.obtenerProductoPorId(datos.id_prod_det);
    if (!producto) throw new Error('El producto no existe');
    if (datos.cantidad_det < 1) throw new Error('La cantidad debe ser al menos 1');
    return detalleRepositorio.crearDetalle(datos);
};

export const actualizarDetalle = async (datos) => {
    if (!datos.id_venta_det || !datos.id_prod_det || !datos.cantidad_det) {
        throw new Error('Faltan campos obligatorios: id_venta_det, id_prod_det, cantidad_det');
    }
    // Puedes agregar las mismas validaciones de existencia si gustas
    return detalleRepositorio.actualizarDetalle(datos);
};

export const eliminarDetalle = (datos) => detalleRepositorio.eliminarDetalle(datos);
