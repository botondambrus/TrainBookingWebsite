import { executeQuery } from './db.js';

async function getLogin(username) {
  const getLoginQuery = `
        SELECT password, role
        FROM Users
        WHERE username = ?
        `;

  try {
    const result = await executeQuery(getLoginQuery, [username]);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { getLogin };
