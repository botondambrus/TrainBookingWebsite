import { createPool } from 'mysql2';

const pool = createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database',
});

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

export { pool, executeQuery };
