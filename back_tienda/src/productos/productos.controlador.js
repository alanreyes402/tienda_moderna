import * as productosServicio from './productos.servicio.js';

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await productosServicio.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await productosServicio.obtenerProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await productosServicio.crearProducto(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await productosServicio.actualizarProducto(req.params.id, req.body);
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        await productosServicio.eliminarProducto(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
