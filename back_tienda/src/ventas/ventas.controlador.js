import * as ventasServicio from './ventas.servicio.js';

export const obtenerVentas = async (req, res) => {
    try {
        const ventas = await ventasServicio.obtenerVentas();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await ventasServicio.obtenerVentaPorId(req.params.id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearVenta = async (req, res) => {
    try {
        const nuevaVenta = await ventasServicio.crearVenta(req.body);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarVenta = async (req, res) => {
    try {
        const ventaActualizada = await ventasServicio.actualizarVenta(req.params.id, req.body);
        if (!ventaActualizada) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(ventaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarVenta = async (req, res) => {
    try {
        await ventasServicio.eliminarVenta(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
