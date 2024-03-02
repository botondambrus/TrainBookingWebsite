import { executeQuery } from './db.js';

async function initializeDatabase() {
  const createJaratokTableQuery = `
      CREATE TABLE IF NOT EXISTS Jaratok (
        id INT AUTO_INCREMENT PRIMARY KEY,
        indulas VARCHAR(30),
        erkezes VARCHAR(30),
        indulasiIdo TIME, 
        erkezesiIdo TIME,
        nap VARCHAR(30), 
        ar INT, 
        tipus VARCHAR(30))
        `;

  const createFelhasznalokTableQuery = `
        CREATE TABLE IF NOT EXISTS Felhasznalok (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nev VARCHAR(30),
            felhasznalonev VARCHAR(30),
            jelszo VARCHAR(200),
            email VARCHAR(30),
            role VARCHAR(30))
        `;

  const createUtasokTableQuery = `
        CREATE TABLE IF NOT EXISTS Utasok (
            id INT AUTO_INCREMENT PRIMARY KEY,
            felhasznaloId INT,
            jaratId INT,
            datum DATE,
            FOREIGN KEY (jaratId) REFERENCES Jaratok(id),
            FOREIGN KEY (felhasznaloId) REFERENCES Felhasznalok(id))
        `;

  const insertDefaultJaratokQuery = `
      INSERT INTO Jaratok (indulas, erkezes, indulasiIdo, erkezesiIdo, nap, ar, tipus) 
      VALUES 
          ('Budapest', 'London', '10:00', '12:00', 'Hetfo', 100, 'Vonat'),
          ('Budapest', 'Berlin', '14:00', '16:00', 'Kedd', 120, 'Vonat');
        `;

  const checkJaratokTableQuery = 'SELECT COUNT(*) AS count FROM Jaratok';

  try {
    await executeQuery(createJaratokTableQuery);
    await executeQuery(createFelhasznalokTableQuery);
    await executeQuery(createUtasokTableQuery);

    const result = await executeQuery(checkJaratokTableQuery);

    if (result[0].count === 0) {
      await executeQuery(insertDefaultJaratokQuery);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { initializeDatabase };
