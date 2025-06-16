import * as bitacoraServicio from './bitacora_cortes.servicio.js';

export const obtenerCortes = async (req, res) => {
    try {
        const cortes = await bitacoraServicio.obtenerCortes();
        res.json(cortes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerCortePorId = async (req, res) => {
    try {
        const corte = await bitacoraServicio.obtenerCortePorId(req.params.id);
        if (!corte) {
            return res.status(404).json({ error: 'Corte no encontrado' });
        }
        res.json(corte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearCorte = async (req, res) => {
    try {
        const nuevoCorte = await bitacoraServicio.crearCorte(req.body);
        res.status(201).json(nuevoCorte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarCorte = async (req, res) => {
    try {
        const corteActualizado = await bitacoraServicio.actualizarCorte(req.params.id, req.body);
        if (!corteActualizado) {
            return res.status(404).json({ error: 'Corte no encontrado' });
        }
        res.json(corteActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarCorte = async (req, res) => {
    try {
        await bitacoraServicio.eliminarCorte(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
