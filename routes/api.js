import { Router } from 'express';
import { getTrainById } from '../database/trains_db.js';
import { deleteReservation } from '../database/reservations_db.js';

const router = Router();

router.get('/:trainId', async (req, res) => {
  const { trainId } = req.params;

  if (!trainId) {
    return res.status(400).send('Train ID is not provided!');
  }
  if (trainId < 0) {
    return res.status(400).send('ID cannot be negative!');
  }
  try {
    const train = await getTrainById(trainId);
    if (!train) {
      return res.status(400).send('No match found!');
    }
    return res.status(200).send(train[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

router.delete('/deleteReservation/:reservationId', (req, res) => {
  const { reservationId } = req.params;
  if (!reservationId) {
    return res.status(400).send('Reservation ID is not provided!');
  }
  if (reservationId < 0) {
    return res.status(400).send('ID cannot be negative!');
  }
  try {
    deleteReservation(reservationId);
    return res.status(200).send('Deletion successful!');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

export default router;
