import { executeQuery } from './db.js';

async function initializeDatabase() {
  const createTrainsTableQuery = `
      CREATE TABLE IF NOT EXISTS Trains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        departure VARCHAR(30),
        arrival VARCHAR(30),
        departureTime TIME, 
        arrivalTime TIME,
        day VARCHAR(30), 
        price INT, 
        type VARCHAR(30))
        `;

  const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30),
            username VARCHAR(30),
            password VARCHAR(200),
            email VARCHAR(30),
            role VARCHAR(30))
        `;

  const createPassengersTableQuery = `
        CREATE TABLE IF NOT EXISTS Passengers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT,
            trainId INT,
            date DATE,
            FOREIGN KEY (trainId) REFERENCES Trains(id),
            FOREIGN KEY (userId) REFERENCES Users(id))
        `;

  const insertDefaultTrainsQuery = `
      INSERT INTO Trains (departure, arrival, departureTime, arrivalTime, day, price, type) 
      VALUES 
          ('Budapest', 'London', '10:00', '12:00', 'Monday', 100, 'Intercity'),
          ('Budapest', 'Berlin', '14:00', '16:00', 'Tuesday', 120, 'Intercity'),;
        `;

  const checkTrainsTableQuery = 'SELECT COUNT(*) AS count FROM Trains';

  try {
    await executeQuery(createTrainsTableQuery);
    await executeQuery(createUsersTableQuery);
    await executeQuery(createPassengersTableQuery);

    const result = await executeQuery(checkTrainsTableQuery);

    if (result[0].count === 0) {
      await executeQuery(insertDefaultTrainsQuery);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { initializeDatabase };
