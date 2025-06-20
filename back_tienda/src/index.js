import express from 'express';
import cors from 'cors';
import productosRoutes from './Routes/productos.js';
import marcasRoutes from './Routes/marcas.js';
import proveedoresRoutes from './Routes/proveedores.js';
import clientesRoutes from './Routes/clientes.js';
import ventasRoutes from './Routes/ventas.js';
import cortesRoutes from './Routes/cortes.js';       
import reportesRoutes from './Routes/reportes.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/proveedores', proveedoresRoutes); 
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/cortes', cortesRoutes);         
app.use('/api/reportes', reportesRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});