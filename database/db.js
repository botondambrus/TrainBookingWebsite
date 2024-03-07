import { createPool } from 'mysql2';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'vonattarsasag',
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
