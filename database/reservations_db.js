import { executeQuery } from './db.js';

async function insertReservation(id, userId, date) {
  const insertReservationQuery = `
      INSERT INTO Passengers (trainId, userId, date)
      VALUES (?, ?, ?)
      `;
  const values = [id, userId, date];

  try {
    const result = await executeQuery(insertReservationQuery, values);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getReservationsByTrainId(id) {
  const getReservationsByTrainIdQuery = `
      SELECT Passengers.id, name, email, date
      FROM Passengers
      INNER JOIN Users ON Passengers.userId = Users.id
      WHERE trainId = ?
    `;

  try {
    const result = await executeQuery(getReservationsByTrainIdQuery, id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteReservation(reservationId) {
  const deleteReservationQuery = `
      DELETE FROM Passengers
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(deleteReservationQuery, reservationId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function deleteReservationsByTrainId(trainId) {
  const deleteReservationsByTrainIdQuery = `
      DELETE FROM Passengers
      WHERE trainId = ?
    `;
  try {
    const result = await executeQuery(deleteReservationsByTrainIdQuery, trainId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getReservationsByUser(username) {
  const getReservationsByUserQuery = `
      SELECT trainId, passengers.id, date, departure, arrival, departureTime, arrivalTime, day, type, price
      FROM Passengers
      INNER JOIN Trains ON Passengers.trainId = Trains.id JOIN Users ON Passengers.userId = Users.id
      WHERE username = ?
    `;
  try {
    const result = await executeQuery(getReservationsByUserQuery, username);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateReservation(reservationId, date) {
  const updateReservationQuery = `
      UPDATE Passengers
      SET date = ?
      WHERE id = ?
    `;
  const values = [date, reservationId];
  try {
    const result = await executeQuery(updateReservationQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getTrainIdByReservation(reservationId) {
  const getTrainIdByReservationQuery = `
      SELECT trainId
      FROM Passengers
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getTrainIdByReservationQuery, reservationId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getUserIdByReservationId(reservationId) {
  const getUserIdByReservationIdQuery = `
      SELECT userId
      FROM Passengers
      WHERE id = ?
    `;
  try {
    const result = await executeQuery(getUserIdByReservationIdQuery, reservationId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  insertReservation,
  getReservationsByTrainId,
  deleteReservation,
  deleteReservationsByTrainId,
  getReservationsByUser,
  updateReservation,
  getTrainIdByReservation,
  getUserIdByReservationId,
};
