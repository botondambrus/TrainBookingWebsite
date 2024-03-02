import { executeQuery } from './db.js';

async function insertJarat(indulasIdo, erkezesIdo, indulas, erkezes, nap, tipus, ar) {
  const insertJaratQuery = `
      INSERT INTO Jaratok (indulasiIdo, erkezesiIdo, indulas, erkezes, nap, tipus, ar) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

  try {
    const result = await executeQuery(insertJaratQuery, [indulasIdo, erkezesIdo, indulas, erkezes, nap, tipus, ar]);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function keresesJaratok(indulas, erkezes, minimumAr, maximumAr) {
  let keresesJaratokQuery = `
      SELECT id, indulas, erkezes, indulasiIdo, erkezesiIdo, nap, tipus, ar, TIMEDIFF(erkezesiIdo, indulasiIdo) AS 'osszido'
      FROM Jaratok
      WHERE 1 = 1
    `;

  const values = [];

  if (indulas) {
    keresesJaratokQuery += ' AND indulas = ?';
    values.push(indulas);
  }

  if (erkezes) {
    keresesJaratokQuery += ' AND erkezes = ?';
    values.push(erkezes);
  }

  if (minimumAr) {
    keresesJaratokQuery += ' AND ar >= ?';
    values.push(minimumAr);
  }

  if (maximumAr) {
    keresesJaratokQuery += ' AND ar <= ?';
    values.push(maximumAr);
  }

  keresesJaratokQuery += ' ORDER BY indulasiIdo';

  try {
    const result = await executeQuery(keresesJaratokQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getJarat(id) {
  const getJaratIdQuery = `
      SELECT id
      FROM Jaratok
      WHERE id = ?
    `;

  try {
    const result = await executeQuery(getJaratIdQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getJaratById(id) {
  const getJaratByIdQuery = `
      SELECT id, indulas, erkezes, indulasiIdo, erkezesiIdo, nap, tipus, ar
      FROM Jaratok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getJaratByIdQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getNapJarat(id) {
  const getNapJaratQuery = `
      SELECT nap
      FROM Jaratok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getNapJaratQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteJarat(id) {
  const deleteJaratQuery = `
      DELETE FROM Jaratok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(deleteJaratQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllByJaratId(jaratId) {
  const getAllByJaratIdQuery = `
      SELECT id, indulas, erkezes, indulasiIdo, erkezesiIdo, nap, tipus, ar
      FROM Jaratok
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getAllByJaratIdQuery, jaratId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getJaratok2Atszalassal(indulas, erkezes, minimumAr, maximumAr) {
  let getJaratok2AtszalassalQuery = `
  SELECT CONCAT(j1.id, '->', j2.id, '->', j3.id) AS atszallas, j1.indulas, j3.erkezes, j1.indulasiIdo, j3.erkezesiIdo, j1.nap, j1.tipus, j1.ar + j2.ar + j3.ar AS ar, TIMEDIFF(j3.erkezesiIdo, j1.indulasiIdo) AS 'osszido'
  FROM Jaratok j1
  INNER JOIN Jaratok j2 ON j1.erkezes = j2.indulas
  INNER JOIN Jaratok j3 ON j2.erkezes = j3.indulas
  WHERE j2.indulasiIdo >= j1.erkezesiIdo AND j3.indulasiIdo >= j2.erkezesiIdo AND
        j1.nap = j2.nap AND j2.nap = j3.nap`;

  const values = [];

  if (indulas) {
    getJaratok2AtszalassalQuery += ' AND j1.indulas = ?';
    values.push(indulas);
  }

  if (erkezes) {
    getJaratok2AtszalassalQuery += ' AND j3.erkezes = ?';
    values.push(erkezes);
  }

  if (minimumAr) {
    getJaratok2AtszalassalQuery += ' AND (j1.ar + j2.ar + j3.ar) >= ?';
    values.push(minimumAr);
  }

  if (maximumAr) {
    getJaratok2AtszalassalQuery += ' AND (j1.ar + j2.ar + j3.ar) <= ?';
    values.push(maximumAr);
  }

  getJaratok2AtszalassalQuery += ' ORDER BY j1.indulas, j3.erkezes ';

  try {
    const result = await executeQuery(getJaratok2AtszalassalQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getJaratok1Atszalassal(indulas, erkezes, minimumAr, maximumAr) {
  let getJaratok1AtszalassalQuery = `
  SELECT CONCAT(j1.id, '->', j2.id) AS atszallas, j1.indulas, j2.erkezes, j1.indulasiIdo, j2.erkezesiIdo, j1.nap, j1.tipus, j1.ar + j2.ar AS ar, TIMEDIFF(j2.erkezesiIdo, j1.indulasiIdo) AS 'osszido'
  FROM Jaratok j1
  INNER JOIN Jaratok j2 ON j1.erkezes = j2.indulas
  WHERE j2.indulasiIdo >= j1.erkezesiIdo AND
        j1.nap = j2.nap`;

  const values = [];

  if (indulas) {
    getJaratok1AtszalassalQuery += ' AND j1.indulas = ?';
    values.push(indulas);
  }

  if (erkezes) {
    getJaratok1AtszalassalQuery += ' AND j2.erkezes = ?';
    values.push(erkezes);
  }

  if (minimumAr) {
    getJaratok1AtszalassalQuery += ' AND (j1.ar + j2.ar) >= ?';
    values.push(minimumAr);
  }

  if (maximumAr) {
    getJaratok1AtszalassalQuery += ' AND (j1.ar + j2.ar) <= ?';
    values.push(maximumAr);
  }

  getJaratok1AtszalassalQuery += ' ORDER BY j1.indulasiIdo, j2.erkezesiIdo';

  try {
    const result = await executeQuery(getJaratok1AtszalassalQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  insertJarat,
  keresesJaratok,
  getJarat,
  getJaratById,
  getNapJarat,
  deleteJarat,
  getAllByJaratId,
  getJaratok2Atszalassal,
  getJaratok1Atszalassal,
};
