import express from 'express';
import session from 'express-session';
import { join } from 'path';
import { initializeDatabase } from './database/initialize_db.js';
import foglalas from './routes/foglalas.js';
import kereses from './routes/kereses.js';
import hozzaadas from './routes/hozzaadas.js';
import api from './routes/api.js';
import login from './routes/login.js';
import regisztracio from './routes/regisztracio.js';
import modositas from './routes/modositas.js';
import torles from './routes/torles.js';

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

    app.use('/hozzaadas', hozzaadas);

    app.use('/', kereses);

    app.use('/foglalas', foglalas);

    app.use('/api', api);

    app.use('/login', login);

    app.use('/regisztracio', regisztracio);

    app.use('/modositas', modositas);

    app.use('/torles', torles);

    app.listen(8080, () => {
      console.log('Server listening on http://localhost:8080/ ...');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database');
    console.error(err);
  });
