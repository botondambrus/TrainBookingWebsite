import { executeQuery } from './db.js';

async function getFelhasznaloIdByFelhasznalonev(felhasznalonev) {
  const getFelhasznaloIdByFelhasznalonevQuery = `
      SELECT id
      FROM Felhasznalok
      WHERE felhasznalonev = ?

    `;

  try {
    const result = await executeQuery(getFelhasznaloIdByFelhasznalonevQuery, felhasznalonev);
    return result[0].id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getFelhasznalok() {
  const getFelhasznalokQuery = `
      SELECT id, nev
      FROM Felhasznalok
    `;
  try {
    const result = await executeQuery(getFelhasznalokQuery);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { getFelhasznalok, getFelhasznaloIdByFelhasznalonev };
