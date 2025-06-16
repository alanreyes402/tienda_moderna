import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',        
  user: 'TU_USUARIO',
  password: 'TU_CONTRASEÑA',
  database: 'NOMBRE_BASE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;