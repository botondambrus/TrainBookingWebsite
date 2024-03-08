import sql from 'mssql';

const connectionConfig = {
  server: 'train-sql.database.windows.net',
  database: 'train-sql',
  user: 'boti@train-sql',
  password: 'Furtos11',
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
