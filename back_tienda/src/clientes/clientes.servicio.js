import * as clientesRepositorio from './clientes.repositorio.js';

export const obtenerClientes = () => clientesRepositorio.obtenerClientes();

export const obtenerClientePorId = (id) => clientesRepositorio.obtenerClientePorId(id);

export const crearCliente = (datos) => {
    // Regla de negocio: El nombre del cliente es obligatorio.
    if (!datos.nombre_cli) {
        throw new Error('El campo nombre_cli es obligatorio');
    }
    // Los campos Numero_cli y dir_cli son opcionales.
    return clientesRepositorio.crearCliente(datos);
};

export const actualizarCliente = (id, datos) => {
    if (!datos.nombre_cli) {
        throw new Error('El campo nombre_cli es obligatorio');
    }
    return clientesRepositorio.actualizarCliente(id, datos);
};

export const eliminarCliente = (id) => clientesRepositorio.eliminarCliente(id);