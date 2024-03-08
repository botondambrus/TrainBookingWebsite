import { Router } from 'express';
import { insertReservation, getReservationsByUser, deleteReservation } from '../database/reservations_db.js';
import { getUserIdByUsername } from '../database/users_db.js';
import { getAllByTrainId, getDayTrain } from '../database/trains_db.js';

const router = Router();

router.post('/train/:trainId', async (req, res) => {
  const { trainId } = req.params;
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

  if (!trainId) {
    return res.redirect('/reservation/user?query=error&message=Train ID is not provided!');
  }
  if (trainId < 0) {
    return res.redirect('/reservation/user?query=error&message=ID cannot be negative!');
  }
  if (!username) {
    return res.redirect('/reservation/user?query=error&message=User is not logged in!');
  }
  if (!date) {
    return res.redirect('/reservation/user?query=error&message=Date is not provided!');
  }
  if (new Date(date) < currentDate) {
    return res.redirect('/reservation/user?query=error&message=Date cannot be earlier than today!');
  }

  try {
    const trainDay = await getDayTrain(trainId);

    if (trainDay[0].day !== days[new Date(date).getDay()]) {
      return res.redirect(
        '/reservation/user?query=error&message=Incorrect date selection. The train does not operate on this day!',
      );
    }
    const userId = await getUserIdByUsername(username);
    await insertReservation(trainId, userId, date);
    return res.redirect('/reservation/user?query=success');
  } catch (err) {
    console.error(err);
    return res.redirect('/reservation/user?query=error');
  }
});

router.get('/user', async (req, res) => {
  const { username, role } = req.session;
  const { query, message } = req.query;

  if (!username) {
    return res.redirect('/auth/login');
  }
  try {
    const reservations = await getReservationsByUser(username);
    reservations.forEach((reservation) => {
      reservation.arrivalTime = reservation.arrivalTime.toLocaleTimeString('hu-HU');
      reservation.departureTime = reservation.departureTime.toLocaleTimeString('hu-HU');
    });
    return res.render('reservationUser', { reservations, role, username, query, message });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

router.get('/train/:trainId', async (req, res) => {
  const { trainId } = req.params;
  const { role, username } = req.session;

  if (role === 'guest') {
    return res.redirect('/auth/login');
  }

  if (!trainId) {
    return res.status(400).send('Train ID is not provided!');
  }

  if (trainId < 0) {
    return res.status(400).send('ID cannot be negative!');
  }

  try {
    const trainData = await getAllByTrainId(trainId);
    if (trainData.length === 0) {
      return res.status(401).send('No such train!');
    }

    const transfer = false;

    return res.render('reservationTrain', { trainId, role, username, transfer });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

router.get('/trains/:trainsId', (req, res) => {
  const { trainsId } = req.params;
  const { role, username } = req.session;

  if (role === 'guest') {
    return res.redirect('/auth/login');
  }

  if (!trainsId) {
    return res.status(400).send('Train ID is not provided!');
  }

  const transfer = true;
  const trainId = trainsId;
  return res.render('reservationTrain', { trainId, role, username, transfer });
});

router.post('/trains/:trainsId', async (req, res) => {
  const { trainsId } = req.params;
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

  if (!trainsId) {
    return res.redirect('/reservation/user?query=error&message=Train ID is not provided!');
  }
  if (!username) {
    return res.redirect('/reservation/user?query=error&message=User is not logged in!');
  }
  if (new Date(date) < currentDate) {
    return res.redirect('/reservation/user?query=error&message=Date cannot be earlier than today!');
  }

  const trainsIdArray = trainsId.split('->');

  for (let i = 0; i < trainsIdArray.length; i++) {
    if (trainsIdArray[i] < 0) {
      return res.redirect('/reservation/user?query=error&message=ID cannot be negative!');
    }
  }

  try {
    const userId = await getUserIdByUsername(username);
    const trainDay0 = await getDayTrain(trainsIdArray[0]);
    const trainDay1 = await getDayTrain(trainsIdArray[1]);

    if (trainDay0[0].day !== days[new Date(date).getDay()] || trainDay1[0].day !== days[new Date(date).getDay()]) {
      return res.redirect(
        '/reservation/user?query=error&message=Incorrect date selection. The trains do not operate on this day!',
      );
    }

    if (trainsIdArray.length === 2) {
      await insertReservation(trainsIdArray[0], userId, date);
      await insertReservation(trainsIdArray[1], userId, date);
    }

    if (trainsIdArray.length === 3) {
      const trainDay2 = await getDayTrain(trainsIdArray[2]);

      if (trainDay2[0].day !== days[new Date(date).getDay()]) {
        return res.redirect(
          '/reservation/user?query=error&message=Incorrect date selection. The trains do not operate on this day!',
        );
      }

      await insertReservation(trainsIdArray[0], userId, date);
      await insertReservation(trainsIdArray[1], userId, date);
      await insertReservation(trainsIdArray[2], userId, date);
    }
    return res.redirect('/reservation/user?query=success');
  } catch (err) {
    console.error(err);
    return res.redirect('/reservation/user?query=error');
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
