import { executeQuery } from './db.js';

async function insertTrain(departureTime, arrivalTime, departure, arrival, day, type, price) {
  const insertTrainQuery = `
      INSERT INTO Trains (departureTime, arrivalTime, departure, arrival, day, type, price) 
      VALUES (@departureTime, @arrivalTime, @departure, @arrival, @day, @type, @price)
      `;
  const values = { departureTime, arrivalTime, departure, arrival, day, type, price };

  try {
    const result = await executeQuery(insertTrainQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function searchTrains(departure, arrival, minimumPrice, maximumPrice) {
  let searchTrainsQuery = `
      SELECT id, departure, arrival, departureTime, arrivalTime, day, type, price
      FROM Trains
      WHERE 1 = 1
    `;

  const values = {};

  if (departure) {
    searchTrainsQuery += ' AND departure = @departure';
    values.departure = departure;
  }

  if (arrival) {
    searchTrainsQuery += ' AND arrival = @arrival';
    values.arrival = arrival;
  }

  if (minimumPrice) {
    searchTrainsQuery += ' AND price >= @minimumPrice';
    values.minimumPrice = minimumPrice;
  }

  if (maximumPrice) {
    searchTrainsQuery += ' AND price <= @maximumPrice';
    values.maximumPrice = maximumPrice;
  }

  searchTrainsQuery += ' ORDER BY departureTime';

  try {
    const result = await executeQuery(searchTrainsQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getTrain(id) {
  const getTrainIdQuery = `
      SELECT id
      FROM Trains
      WHERE id = @id
    `;

  try {
    const result = await executeQuery(getTrainIdQuery, { id });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getTrainById(id) {
  const getTrainByIdQuery = `
      SELECT id, departure, arrival, departureTime, arrivalTime, day, type, price
      FROM Trains
      WHERE id = @id
    `;
  try {
    const result = await executeQuery(getTrainByIdQuery, { id });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getDayTrain(id) {
  const getDayTrainQuery = `
      SELECT day
      FROM Trains
      WHERE id = @id
    `;
  try {
    const result = await executeQuery(getDayTrainQuery, { id });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteTrain(id) {
  const deleteTrainQuery = `
      DELETE FROM Trains
      WHERE id = @id
    `;
  try {
    const result = await executeQuery(deleteTrainQuery, { id });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllByTrainId(trainId) {
  const getAllByTrainIdQuery = `
      SELECT id, departure, arrival, departureTime, arrivalTime, day, type, price
      FROM Trains
      WHERE id = @trainId
    `;
  try {
    const result = await executeQuery(getAllByTrainIdQuery, { trainId });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getTrainsWith2Transfers(departure, arrival, minimumPrice, maximumPrice) {
  let getTrainsWith2TransfersQuery = `
  SELECT CONCAT(t1.id, '->', t2.id, '->', t3.id) AS transfers, t1.departure, t3.arrival, t1.departureTime, t3.arrivalTime, t1.day, t1.type, t1.price + t2.price + t3.price AS price
  FROM Trains t1
  INNER JOIN Trains t2 ON t1.arrival = t2.departure
  INNER JOIN Trains t3 ON t2.arrival = t3.departure
  WHERE t2.departureTime >= t1.arrivalTime AND t3.departureTime >= t2.arrivalTime AND
        t1.day = t2.day AND t2.day = t3.day`;

  const values = {};

  if (departure) {
    getTrainsWith2TransfersQuery += ' AND t1.departure = @departure';
    values.departure = departure;
  }

  if (arrival) {
    getTrainsWith2TransfersQuery += ' AND t3.arrival = @arrival';
    values.arrival = arrival;
  }

  if (minimumPrice) {
    getTrainsWith2TransfersQuery += ' AND (t1.price + t2.price + t3.price) >= @minimumPrice';
    values.minimumPrice = minimumPrice;
  }

  if (maximumPrice) {
    getTrainsWith2TransfersQuery += ' AND (t1.price + t2.price + t3.price) <= @maximumPrice';
    values.maximumPrice = maximumPrice;
  }

  getTrainsWith2TransfersQuery += ' ORDER BY t1.departure, t3.arrival ';

  try {
    const result = await executeQuery(getTrainsWith2TransfersQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getTrainsWith1Transfer(departure, arrival, minimumPrice, maximumPrice) {
  let getTrainsWith1TransferQuery = `
  SELECT CONCAT(t1.id, '->', t2.id) AS transfer, t1.departure, t2.arrival, t1.departureTime, t2.arrivalTime, t1.day, t1.type, t1.price + t2.price AS price
  FROM Trains t1
  INNER JOIN Trains t2 ON t1.arrival = t2.departure
  WHERE t2.departureTime >= t1.arrivalTime AND
        t1.day = t2.day`;

  const values = {};

  if (departure) {
    getTrainsWith1TransferQuery += ' AND t1.departure = @departure';
    values.departure = departure;
  }

  if (arrival) {
    getTrainsWith1TransferQuery += ' AND t2.arrival = @arrival';
    values.arrival = arrival;
  }

  if (minimumPrice) {
    getTrainsWith1TransferQuery += ' AND (t1.price + t2.price) >= @minimumPrice';
    values.minimumPrice = minimumPrice;
  }

  if (maximumPrice) {
    getTrainsWith1TransferQuery += ' AND (t1.price + t2.price) <= @maximumPrice';
    values.maximumPrice = maximumPrice;
  }

  getTrainsWith1TransferQuery += ' ORDER BY t1.departureTime, t2.arrivalTime';

  try {
    const result = await executeQuery(getTrainsWith1TransferQuery, values);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  insertTrain,
  searchTrains,
  getTrain,
  getTrainById,
  getDayTrain,
  deleteTrain,
  getAllByTrainId,
  getTrainsWith2Transfers,
  getTrainsWith1Transfer,
};
