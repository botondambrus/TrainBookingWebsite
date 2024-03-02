import { Router } from 'express';
import { insertJarat } from '../database/jaratok_db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { indulasIdo, erkezesIdo, indulas, erkezes, nap, tipus, ar } = req.body;

  if (!indulasIdo || !erkezesIdo || !indulas || !erkezes || !nap || !tipus || !ar) {
    return res.status(400).send('Minden adat megadása kötelező!');
  }

  if (ar < 0) {
    return res.status(401).send('Az ár nem lehet negatív!');
  }

  try {
    const insertId = await insertJarat(indulasIdo, erkezesIdo, indulas, erkezes, nap, tipus, ar);
    if (insertId == null) {
      return res.status(500).send('Hiba történt a járat beszúrása során');
    }
    return res.status(200).redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Hiba történt a járat beszúrása során');
  }
});

router.get('/', (req, res) => {
  const { username, role } = req.session;
  if (role !== 'admin') {
    return res.redirect('/login');
  }
  return res.render('hozzaadas', { felhasznalonev: username });
});
export default router;
