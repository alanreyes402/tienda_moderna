import express from 'express';
import cors from 'cors';

// Importación de todas tus rutas
import productosRoutes from './Routes/productos.js';
import marcasRoutes from './Routes/marcas.js';
import proveedoresRoutes from './Routes/proveedores.js';
import clientesRoutes from './Routes/clientes.js';
import ventasRoutes from './Routes/ventas.js';
import reportesRoutes from './Routes/reportes.js';
import alertasRoutes from './Routes/alertas.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares esenciales
app.use(cors()); // Permite la comunicación entre el frontend y el backend
app.use(express.json()); // Permite al servidor entender y manejar datos en formato JSON

// --- Registro de Endpoints de la API ---
// Se usa el prefijo /api/ para mantener un estándar consistente
app.use('/api/productos', productosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/alertas', alertasRoutes); // <-- Ruta corregida y consistente

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});