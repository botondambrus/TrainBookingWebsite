import { executeQuery } from './db.js';

async function insertFoglalas(id, felhasznaloId, datum) {
  const insertFoglalasQuery = `
      INSERT INTO Utasok (jaratId, felhasznaloId, datum)
      VALUES (?, ?, ?)
      `;
  const values = [id, felhasznaloId, datum];

  try {
    const result = await executeQuery(insertFoglalasQuery, values);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getFoglalasokJarat(id) {
  const getFoglalasokJaratQuery = `
      SELECT Utasok.id, nev, email, datum
      FROM Utasok
      INNER JOIN Felhasznalok ON Utasok.felhasznaloId = Felhasznalok.id
      WHERE jaratId = ?
    `;

  try {
    const result = await executeQuery(getFoglalasokJaratQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteFoglalas(foglalasId) {
  const deleteFoglalasQuery = `
      DELETE FROM Utasok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(deleteFoglalasQuery, foglalasId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteFoglalasByJarat(jaratId) {
  const deleteFoglalasByJaratQuery = `
      DELETE FROM Utasok
      WHERE jaratId = ?
    `;
  try {
    const result = await executeQuery(deleteFoglalasByJaratQuery, jaratId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getFoglalasByUser(felhasznalonev) {
  const getFoglalasByUserQuery = `
      SELECT jaratId, utasok.id, datum, indulas, erkezes, indulasiIdo, erkezesiIdo, nap, tipus, ar
      FROM Utasok
      INNER JOIN Jaratok ON Utasok.jaratId = Jaratok.id JOIN Felhasznalok ON Utasok.felhasznaloId = Felhasznalok.id
      WHERE felhasznalonev = ?
    `;
  try {
    const result = await executeQuery(getFoglalasByUserQuery, felhasznalonev);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateFoglalas(foglalasId, datum) {
  const updateFoglalasQuery = `
      UPDATE Utasok
      SET datum = ?
      WHERE id = ?
    `;
  const values = [datum, foglalasId];
  try {
    const result = await executeQuery(updateFoglalasQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getJaratIdByFoglalas(foglalasId) {
  const getJaratIdByFoglalasQuery = `
      SELECT jaratId
      FROM Utasok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getJaratIdByFoglalasQuery, foglalasId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getFelhasznaloIdByFoglalasId(foglalasId) {
  const getFelhasznaloIdByFoglalasIdQuery = `
      SELECT felhasznaloId
      FROM Utasok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getFelhasznaloIdByFoglalasIdQuery, foglalasId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  insertFoglalas,
  getFoglalasokJarat,
  deleteFoglalas,
  deleteFoglalasByJarat,
  getFoglalasByUser,
  updateFoglalas,
  getJaratIdByFoglalas,
  getFelhasznaloIdByFoglalasId,
};
