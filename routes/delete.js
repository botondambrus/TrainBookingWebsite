import { Router } from 'express';
import { deleteTrain } from '../database/trains_db.js';
import { deleteReservationsByTrainId } from '../database/reservations_db.js';

const router = Router();

router.get('/train/:trainId', async (req, res) => {
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
