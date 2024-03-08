import { executeQuery } from './db.js';

async function setRegistration(username, name, password, email, role) {
  const setRegistrationQuery = `
        INSERT INTO Users (username, name, password, email, role)
        VALUES (@username, @name, @password, @email, @role)
        `;
  try {
    await executeQuery(setRegistrationQuery, { username, name, password, email, role });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getRegistration(username) {
  const getRegistrationQuery = `
        SELECT username, password, role
        FROM Users
        WHERE username = @username
        `;
  try {
    const result = await executeQuery(getRegistrationQuery, { username });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { setRegistration, getRegistration };
