import sql from 'mssql';

const config = {
  user: 'moderna_user',
  password: 'Tienda123',
  server: 'localhost',
  database: 'LaModerna',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión a SQL Server:', err);
  });

// Exportamos sql y pool (NO usamos default)
export { sql, pool };
