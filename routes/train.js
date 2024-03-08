import { Router } from 'express';
import { deleteTrain, getTrainById } from '../database/trains_db.js';
import { deleteReservationsByTrainId } from '../database/reservations_db.js';

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

router.get('/:trainId/delete', async (req, res) => {
  const { trainId } = req.params;
  const { role } = req.session;

  if (!trainId) {
    return res.status(400).send('No train ID provided!');
  }

  if (trainId < 0) {
    return res.status(400).send('ID cannot be negative!');
  }

  if (role !== 'admin') {
    return res.status(401).redirect('/auth/login');
  }

  try {
    await deleteReservationsByTrainId(trainId);
    await deleteTrain(trainId);
    return res.status(200).redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

export default router;
