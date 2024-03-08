import { executeQuery } from './db.js';

async function initializeDatabase() {
  const createTrainsTableQuery = `
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Trains')
      CREATE TABLE Trains (
        id INT IDENTITY(1,1) PRIMARY KEY,
        departure NVARCHAR(30),
        arrival NVARCHAR(30),
        departureTime TIME, 
        arrivalTime TIME,
        day NVARCHAR(30), 
        price INT, 
        type NVARCHAR(30))
        `;

  const createUsersTableQuery = `
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
        CREATE TABLE Users (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(30),
            username NVARCHAR(30),
            password NVARCHAR(200),
            email NVARCHAR(30),
            role NVARCHAR(30))
        `;

  const createPassengersTableQuery = `
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Passengers')
        CREATE TABLE Passengers (
            id INT IDENTITY(1,1) PRIMARY KEY,
            userId INT,
            trainId INT,
            date DATE,
            FOREIGN KEY (trainId) REFERENCES Trains(id),
            FOREIGN KEY (userId) REFERENCES Users(id))
        `;

  const insertDefaultTrainsQuery = `
      INSERT INTO Trains (departure, arrival, departureTime, arrivalTime, day, price, type) 
      VALUES 
          (N'Budapest', N'Berlin', '08:00', '10:00', N'Monday', 100, N'Intercity'),
          (N'Budapest', N'Berlin', '14:00', '16:00', N'Tuesday', 120, N'Intercity');
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
