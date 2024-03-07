import { Router } from 'express';
import bcrypt from 'bcrypt';
import { setRegistration, getRegistration } from '../database/registration_db.js';

const router = Router();

router.get('/', (req, res) => {
  const { query, message } = req.query;
  res.render('registration', { query, message });
});

router.post('/', async (req, res) => {
  const { username, name, email, password, confirmPassword } = req.body;
  const role = 'user';

  if (!username || !name || !password || !email || !confirmPassword) {
    return res.status(400).render('registration', { query: 'error', message: 'Not all fields are filled!' });
  }

  if (password !== confirmPassword) {
    return res.status(400).render('registration', { query: 'error', message: 'Passwords do not match!' });
  }

  const result = await getRegistration(username);
  if (result.length > 0) {
    return res.status(400).render('registration', { query: 'error', message: 'The username is already taken!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await setRegistration(username, name, hashedPassword, email, role);
    return res.status(200).redirect('/auth/login?query=success');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error!');
  }
});

export default router;
