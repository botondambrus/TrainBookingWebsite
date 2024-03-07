import express from 'express';
import session from 'express-session';
import { join } from 'path';
import { initializeDatabase } from './database/initialize_db.js';
import search from './routes/search.js';
import addition from './routes/addition.js';
import api from './routes/api.js';
import auth from './routes/auth.js';
import registration from './routes/registration.js';
import modification from './routes/modification.js';
import deleteRoute from './routes/delete.js';
import reservation from './routes/reservation.js';

const app = express();

const publicDir = join(process.cwd(), 'public');

app.use(express.static(publicDir));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', join(process.cwd(), 'views'));

app.use(
  session({
    secret: '34f6abb23455h23',
    resave: false,
    saveUninitialized: true,
  }),
);

initializeDatabase()
  .then(() => {
    console.log('Database initialized');

    app.use('/', search);

    app.use('/reservation', reservation);

    app.use('/addition', addition);

    app.use('/api', api);

    app.use('/auth', auth);

    app.use('/registration', registration);

    app.use('/modification', modification);

    app.use('/delete', deleteRoute);

    app.listen(8080, () => {
      console.log('Server listening on http://localhost:8080/ ...');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database');
    console.error(err);
  });
