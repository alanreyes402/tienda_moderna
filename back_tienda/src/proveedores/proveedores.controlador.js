
import * as proveedoresServicio from './proveedores.servicio.js';

export const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await proveedoresServicio.obtenerProveedores();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await proveedoresServicio.obtenerProveedorPorId(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = await proveedoresServicio.crearProveedor(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarProveedor = async (req, res) => {
    try {
        const proveedorActualizado = await proveedoresServicio.actualizarProveedor(req.params.id, req.body);
        res.json(proveedorActualizado);
    } catch (error) {
        // también verificamos si el proveedor existe y devolver 404
        res.status(400).json({ error: error.message });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        await proveedoresServicio.eliminarProveedor(req.params.id);
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};