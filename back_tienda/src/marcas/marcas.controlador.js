import * as marcasServicio from './marcas.servicio.js';

export const obtenerMarcas = async (req, res) => {
    try {
        const marcas = await marcasServicio.obtenerMarcas();
        res.json(marcas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMarcaPorId = async (req, res) => {
    try {
        const marca = await marcasServicio.obtenerMarcaPorId(req.params.id);
        if (!marca) {
            return res.status(404).json({ error: 'Marca no encontrada' });
        }
        res.json(marca);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearMarca = async (req, res) => {
    try {
        const nuevaMarca = await marcasServicio.crearMarca(req.body);
        res.status(201).json(nuevaMarca);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarMarca = async (req, res) => {
    try {
        const marcaActualizada = await marcasServicio.actualizarMarca(req.params.id, req.body);
        res.json(marcaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarMarca = async (req, res) => {
    try {
        await marcasServicio.eliminarMarca(req.params.id);
        res.json({ mensaje: 'Marca eliminada' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

