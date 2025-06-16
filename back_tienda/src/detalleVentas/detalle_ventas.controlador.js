import * as detalleServicio from './detalle_ventas.servicio.js';

export const obtenerDetalles = async (req, res) => {
    try {
        const detalles = await detalleServicio.obtenerDetalles();
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDetallesPorVenta = async (req, res) => {
    try {
        const detalles = await detalleServicio.obtenerDetallesPorVenta(req.params.id);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearDetalle = async (req, res) => {
    try {
        const nuevoDetalle = await detalleServicio.crearDetalle(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarDetalle = async (req, res) => {
    try {
        const detalleActualizado = await detalleServicio.actualizarDetalle(req.body);
        res.json(detalleActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarDetalle = async (req, res) => {
    try {
        await detalleServicio.eliminarDetalle(req.body);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
