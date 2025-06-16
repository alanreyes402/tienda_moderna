import * as bitacoraRepositorio from './bitacora_cortes.repositorio.js';

export const obtenerCortes = () => bitacoraRepositorio.obtenerCortes();

export const obtenerCortePorId = (id) => bitacoraRepositorio.obtenerCortePorId(id);

export const crearCorte = (datos) => {
    if (!datos.monto_corte || isNaN(Number(datos.monto_corte)) || Number(datos.monto_corte) < 0) {
        throw new Error('El campo monto_corte es obligatorio y debe ser positivo');
    }
    if (!datos.fecha_corte) {
        throw new Error('El campo fecha_corte es obligatorio');
    }
    if (!datos.nombre_corte) {
        throw new Error('El campo nombre_corte es obligatorio');
    }
    return bitacoraRepositorio.crearCorte(datos);
};

export const actualizarCorte = async (id, datos) => {
    const corte = await bitacoraRepositorio.obtenerCortePorId(id);
    if (!corte) return null;
    if (!datos.monto_corte || isNaN(Number(datos.monto_corte)) || Number(datos.monto_corte) < 0) {
        throw new Error('El campo monto_corte es obligatorio y debe ser positivo');
    }
    if (!datos.fecha_corte) {
        throw new Error('El campo fecha_corte es obligatorio');
    }
    if (!datos.nombre_corte) {
        throw new Error('El campo nombre_corte es obligatorio');
    }
    return bitacoraRepositorio.actualizarCorte(id, datos);
};

export const eliminarCorte = (id) => bitacoraRepositorio.eliminarCorte(id);
