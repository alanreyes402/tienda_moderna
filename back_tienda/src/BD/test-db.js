import db from './MySQL.js';

async function testConnection() {
  try {
    const result = await db.request().query('SELECT 1 + 1 AS resultado');
    console.log('Conexión exitosa:', result.recordset[0].resultado);
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

testConnection();