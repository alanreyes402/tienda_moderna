import express from 'express';
import cors from 'cors';

// Rutas
import productosRoutes from './Routes/productos.js';
import marcasRoutes from './Routes/marcas.js';
import proveedoresRoutes from './Routes/proveedores.js';
import clientesRoutes from './Routes/clientes.js';
import ventasRoutes from './Routes/ventas.js';
// ⚠️ Eliminamos esta porque ya no es necesaria:
// import cortesRoutes from './Routes/cortes.js';
import reportesRoutes from './Routes/reportes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/productos', productosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);
// ✅ Ya no usamos esta línea ↓
// app.use('/api/cortes', cortesRoutes);
app.use('/api/reportes', reportesRoutes); // Incluye /ventas, /ticket/:id y /cortes

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
