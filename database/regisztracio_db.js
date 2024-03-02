import { executeQuery } from './db.js';

async function setRegisztracio(felhasznalonev, nev, jelszo, email, role) {
  const setRegisztracioQuery = `
        INSERT INTO Felhasznalok ( felhasznalonev, nev, jelszo, email, role)
        VALUES (?, ?, ?, ?, ?)
        `;
  try {
    await executeQuery(setRegisztracioQuery, [felhasznalonev, nev, jelszo, email, role]);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getRegisztracio(felhasznalonev) {
  const getRegisztracioQuery = `
        SELECT felhasznalonev, jelszo, role
        FROM Felhasznalok
        WHERE felhasznalonev = ?
        `;
  try {
    const result = await executeQuery(getRegisztracioQuery, [felhasznalonev]);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { setRegisztracio, getRegisztracio };
