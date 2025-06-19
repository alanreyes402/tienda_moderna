import sql from 'mssql';

const config = {
  user: 'moderna_user',
  password: 'tienda123',
  server: 'localhost',
  database: 'LaModerna',
  options: {
    encrypt: false,                // No usamos SSL
    trustServerCertificate: true  // Necesario en entorno local
  },
  port: 1433                      // Puerto por defecto de SQL Server
};

const pool = await sql.connect(config);
export default pool;