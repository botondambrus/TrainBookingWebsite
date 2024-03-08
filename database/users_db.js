import { executeQuery } from './db.js';

async function getUserIdByUsername(username) {
  const getUserIdByUsernameQuery = `
      SELECT id
      FROM Users
      WHERE username = @username
    `;

  try {
    const result = await executeQuery(getUserIdByUsernameQuery, { username });
    return result[0].id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getUsers() {
  const getUsersQuery = `
      SELECT id, name
      FROM Users
    `;
  try {
    const result = await executeQuery(getUsersQuery);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { getUsers, getUserIdByUsername };
