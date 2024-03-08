import { Router } from 'express';
import { insertTrain } from '../database/trains_db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { departureTime, arrivalTime, departure, arrival, day, type, price } = req.body;

  if (!departureTime || !arrivalTime || !departure || !arrival || !day || !type || !price) {
    return res.status(400).send('All data must be provided!');
  }

  if (price < 0) {
    return res.status(400).send('Price cannot be negative!');
  }

  try {
    await insertTrain(departureTime, arrivalTime, departure, arrival, day, type, price);
    return res.status(200).redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error occurred while inserting train');
  }
});

router.get('/', (req, res) => {
  const { username, role } = req.session;
  if (role !== 'admin') {
    return res.redirect('/auth/login');
  }
  return res.render('addition', { username });
});

export default router;
