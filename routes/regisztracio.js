import { Router } from 'express';
import bcrypt from 'bcrypt';
import { setRegisztracio, getRegisztracio } from '../database/regisztracio_db.js';

const router = Router();
router.get('/', (req, res) => {
  const { query, message } = req.query;
  res.render('regisztracio', { query, message });
});

router.post('/', async (req, res) => {
  const { felhasznalonev, nev, email, jelszo, jelszoismetles } = req.body;
  const role = 'user';

  if (!felhasznalonev || !nev || !jelszo || !email || !jelszoismetles) {
    return res.status(401).render('regisztracio', { query: 'error', message: 'Nincs minden mező kitöltve!' });
  }

  if (jelszo !== jelszoismetles) {
    return res.status(401).render('regisztracio', { query: 'error', message: 'A jelszavak nem egyeznek!' });
  }

  const result = await getRegisztracio(felhasznalonev);
  if (result.length > 0) {
    return res.status(401).render('regisztracio', { query: 'error', message: 'A felhasználónév már foglalt!' });
  }

  try {
    const hashWithSalt = await bcrypt.hash(jelszo, 10);
    await setRegisztracio(felhasznalonev, nev, hashWithSalt, email, role);
    return res.status(200).redirect('/login?query=success');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

export default router;
