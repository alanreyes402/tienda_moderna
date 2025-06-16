import * as clientesServicio from './clientes.servicio.js';

export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clientesServicio.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await clientesServicio.obtenerClientePorId(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearCliente = async (req, res) => {
    try {
        const nuevoCliente = await clientesServicio.crearCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await clientesServicio.actualizarCliente(req.params.id, req.body);
        if (!clienteActualizado) {
             return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(clienteActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarCliente = async (req, res) => {
    try {
        await clientesServicio.eliminarCliente(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};