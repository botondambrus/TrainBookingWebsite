import { Router } from 'express';
import bcrypt from 'bcrypt';

import { getLogin } from '../database/login_db.js';

const router = Router();

router.get('/login', (req, res) => {
  const { query, message } = req.query;
  res.render('login', { query, message });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username or password not provided!');
  }
  try {
    const result = await getLogin(username);
    if (result.length === 0) {
      return res.status(401).render('login', { query: 'error', message: 'Incorrect username!' });
    }

    const match = await bcrypt.compare(password, result[0].password);
    if (!match) {
      return res.status(401).render('login', { query: 'error', message: 'Incorrect password!' });
    }
    req.session.username = username;
    req.session.role = result[0].role;
    return res.status(200).redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/auth/login');
});

export default router;
