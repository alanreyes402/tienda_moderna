

// ----------------------------------------------------------------
// 1. IMPORTACIONES
// ----------------------------------------------------------------
import express from 'express';
import db from './BD/MySQL.js'; // Ajusta la ruta si no es exacta

// Importamos los enrutadores de cada módulo. Cada uno es como un "mini-API"
// especializado en su propia área de negocio.
import marcasRouter from './marcas/marcas.rutas.js';
import proveedoresRouter from './proveedores/proveedores.rutas.js';
import productosRouter from './productos/productos.rutas.js';
import clientesRouter from './clientes/clientes.rutas.js';
import ventasRouter from './ventas/ventas.rutas.js';
import detalleVentasRouter from './detalleVentas/detalle_ventas.rutas.js';

import bitacoraCortesRouter from './bitacoraCortes/bitacora_cortes.rutas.js';


/////el error lo marca aca en el import de bitacora


// ----------------------------------------------------------------
// 2. INICIALIZACIÓN Y MIDDLEWARES GLOBALES
// ----------------------------------------------------------------
const app = express();

// Middleware para que Express pueda interpretar bodies de peticiones en formato JSON.
// Es crucial para las peticiones POST y PUT.
app.use(express.json());


// ----------------------------------------------------------------
// 3. RUTA RAÍZ (PUNTO DE BIENVENIDA)
// ----------------------------------------------------------------
// Proporciona una respuesta en la raíz del API para verificar su estado.
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: '¡API de La Moderna funcionando correctamente! 🚀',
        "hora_actual": new Date().toLocaleTimeString('es-MX'),
        "fecha_actual": new Date().toLocaleDateString('es-MX'),
    });
});


// ----------------------------------------------------------------
// 4. CONEXIÓN DE LAS RUTAS DE LOS MÓDULOS
// ----------------------------------------------------------------
// Aquí conectamos cada enrutador a una ruta base. Esto mantiene el API
// organizado y RESTful.

// Rutas para la gestión de Marcas
app.use('/api/marcas', marcasRouter);

// Rutas para la gestión de Proveedores
app.use('/api/proveedores', proveedoresRouter);

// Rutas para la gestión de Productos
app.use('/api/productos', productosRouter);

// Rutas para la gestión de Clientes
app.use('/api/clientes', clientesRouter);

// Rutas para la gestión de Ventas
app.use('/api/ventas', ventasRouter);

// Rutas para la gestión de los Detalles de Venta
app.use('/api/detalle-ventas', detalleVentasRouter);

// Rutas para la gestión de la Bitácora de Cortes
app.use('/api/bitacora-cortes', bitacoraCortesRouter);


// ----------------------------------------------------------------
// 5. EXPORTACIÓN
// ----------------------------------------------------------------
// Exportamos la instancia de 'app' para que el archivo de entrada
// (index.js) pueda iniciar el servidor.
export default app;