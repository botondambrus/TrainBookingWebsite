import { Router } from 'express';
import { deleteJarat } from '../database/jaratok_db.js';
import { deleteFoglalasByJarat } from '../database/foglalasok_db.js';

const router = Router();

router.get('/jarat/:jaratId', async (req, res) => {
  const { jaratId } = req.params;
  const { role } = req.session;

  if (!jaratId) {
    return res.status(401).send('Nincs megadva járat ID!');
  }

  if (jaratId < 0) {
    return res.status(401).send('Az ID nem lehet negatív!');
  }

  if (role !== 'admin') {
    return res.status(403).redirect('/login');
  }

  try {
    await deleteFoglalasByJarat(jaratId);
    await deleteJarat(jaratId);
    return res.status(200).redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

export default router;
