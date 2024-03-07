import { Router } from 'express';
import { updateReservation, getTrainIdByReservation, getUserIdByReservationId } from '../database/reservations_db.js';
import { getDayTrain } from '../database/trains_db.js';
import { getUserIdByUsername } from '../database/users_db.js';

const router = Router();

router.post('/:reservationId', async (req, res) => {
  const { reservationId } = req.params;
  const { date } = req.body;
  const { username } = req.session;

  const currentDate = new Date();
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  currentDate.setHours(0, 0, 0, 0);

  if (!reservationId) {
    return res.redirect('/reservation/user?query=errorModification&message=No reservation ID provided!');
  }
  if (reservationId < 0) {
    return res.redirect('/reservation/user?query=errorModification&message=ID cannot be negative!');
  }
  if (!username) {
    return res.redirect('/reservation/user?query=errorModification&message=Not logged in!');
  }
  if (!date) {
    return res.redirect('/reservation/user?query=errorModification&message=No date provided!');
  }
  if (new Date(date) < currentDate) {
    return res.redirect('/reservation/user?query=errorModification&message=Date cannot be earlier than today!');
  }

  try {
    const trainId = await getTrainIdByReservation(reservationId);
    if (trainId.length === 0) {
      return res.redirect('/reservation/user?query=errorModification&message=No such reservation!');
    }
    const dayTrain = await getDayTrain(trainId[0].trainId);

    const userId = await getUserIdByUsername(username);
    const userIdReservation = await getUserIdByReservationId(reservationId);

    if (userId !== userIdReservation[0].userId) {
      return res.redirect(
        '/reservation/user?query=errorModification&message=Incorrect user data. The reservation does not belong to the logged-in user!',
      );
    }

    if (dayTrain[0].day !== days[new Date(date).getDay()]) {
      return res.redirect(
        '/reservation/user?query=errorModification&message=Incorrect date selection. The train does not run on this day!',
      );
    }

    await updateReservation(reservationId, date);
    return res.redirect('/reservation/user?query=successModification');
  } catch (err) {
    console.error(err);
    return res.redirect('/reservation/user?query=errorModification');
  }
});

router.get('/:reservationId', async (req, res) => {
  const { reservationId } = req.params;
  const { role, username } = req.session;

  if (role === 'guest') {
    return res.redirect('/auth/login');
  }

  if (!reservationId) {
    return res.status(400).send('No reservation ID provided!');
  }

  if (reservationId < 0) {
    return res.status(400).send('ID cannot be negative!');
  }

  try {
    const trainId = await getTrainIdByReservation(reservationId);

    if (trainId.length === 0) {
      return res.redirect('/reservation/user?query=errorModification&message=No such reservation!');
    }

    const userId = await getUserIdByUsername(username);
    const userIdReservation = await getUserIdByReservationId(reservationId);

    if (userId !== userIdReservation[0].userId) {
      return res.redirect(
        '/reservation/user?query=errorModification&message=Incorrect user data. The reservation does not belong to the logged-in user!',
      );
    }

    return res.render('modification', { reservationId, role, username });
  } catch (err) {
    console.error(err);
    return res.redirect('/reservation/user?query=errorModification');
  }
});

export default router;
