import { Router } from 'express';
import { searchTrains, getTrainsWith2Transfers, getTrainsWith1Transfer } from '../database/trains_db.js';

const router = Router();
let role = 'guest';
let username = '';

router.use((req, _res, next) => {
  if (req.session.username) {
    role = req.session.role;
    username = req.session.username;
  } else {
    role = 'guest';
    username = '';
  }
  next();
});

router.get('/', async (req, res) => {
  let { departure, arrival, minimumPrice, maximumPrice } = req.query;

  if (minimumPrice && maximumPrice && (minimumPrice < 0 || maximumPrice < 0)) {
    return res.status(401).send('Price cannot be negative!');
  }

  departure = departure || '';
  arrival = arrival || '';
  minimumPrice = minimumPrice || '';
  maximumPrice = maximumPrice || '';

  try {
    const trains = await searchTrains(departure, arrival, minimumPrice, maximumPrice);
    const trainsWith2Transfers = await getTrainsWith2Transfers(departure, arrival, minimumPrice, maximumPrice);
    const trainsWith1Transfer = await getTrainsWith1Transfer(departure, arrival, minimumPrice, maximumPrice);

    const trainsWithTransfers = trainsWith1Transfer.concat(trainsWith2Transfers);

    trains.forEach((train) => {
      train.departureTime = train.departureTime.toLocaleTimeString('hu-HU');
      train.arrivalTime = train.arrivalTime.toLocaleTimeString('hu-HU');
    });

    trainsWithTransfers.forEach((train) => {
      train.departureTime = train.departureTime.toLocaleTimeString('hu-HU');
      train.arrivalTime = train.arrivalTime.toLocaleTimeString('hu-HU');
    });

    return res.status(200).render('index', {
      trains,
      trainsWithTransfers,
      departure,
      arrival,
      minimumPrice,
      maximumPrice,
      role,
      username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

export default router;
