// src/index.js

// 1. Importaciones
import db from './BD/MySQL.js'; // Ajusta la ruta si no es exacta
import app from './app.js';         // Importamos nuestra aplicación Express
import { config } from './config.js'; // Importamos nuestra configuración

// 2. Variables de Entorno
const PORT = config.port;
const probarConexion = async () => {
  try {
    const [result] = await db.query('SELECT NOW() AS hora');
    console.log('✅ Conexión a la base de datos exitosa:', result[0].hora);
  } catch (error) {
  console.error('❌ Error al conectar a la base de datos:', error); // <- no uses solo error.message
}
};
probarConexion();
// 3. Iniciar el Servidor
// El método listen() enciende el servidor y lo deja escuchando peticiones en el puerto que le pasamos.
// El segundo argumento es una función "callback" que se ejecuta una vez que el servidor está listo.
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}`);
    console.log(`Hora de inicio: ${new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City' })} del 15 de Junio, 2025`);
});