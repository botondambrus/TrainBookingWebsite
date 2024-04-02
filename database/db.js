import sql from 'mssql';

const connectionConfig = {
  server: '',
  database: '',
  user: '',
  password: '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(connectionConfig);

const executeQuery = async (query, params) => {
  await pool.connect();
  const request = pool.request();
  if (params) {
    Object.keys(params).forEach((key) => {
      request.input(key, params[key]);
    });
  }

  const result = await request.query(query);
  return 'recordset' in result ? result.recordset : [];
};

export { pool, executeQuery };
