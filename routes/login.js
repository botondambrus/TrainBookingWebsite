import { Router } from 'express';
import bcrypt from 'bcrypt';

import { getLogin } from '../database/login_db.js';

const router = Router();

router.get('/', (req, res) => {
  const { query, message } = req.query;
  res.render('login', { query, message });
});

router.post('/', async (req, res) => {
  const { felhasznalonev, jelszo } = req.body;

  if (!felhasznalonev || !jelszo) {
    return res.status(401).send('Nincs megadva a felhasznalonev vagy a jelszo!');
  }
  try {
    const result = await getLogin(felhasznalonev);
    if (result.length === 0) {
      return res.status(401).render('login', { query: 'error', message: 'Hibás felhasználónév!' });
    }

    const match = await bcrypt.compare(jelszo, result[0].jelszo);
    if (!match) {
      return res.status(401).render('login', { query: 'error', message: 'Hibás jelszó!' });
    }
    req.session.username = felhasznalonev;
    req.session.role = result[0].role;
    return res.status(200).redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/login');
});

export default router;
