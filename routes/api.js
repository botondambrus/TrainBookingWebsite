import { Router } from 'express';
import { getJaratById } from '../database/jaratok_db.js';
import { deleteFoglalas } from '../database/foglalasok_db.js';

const router = Router();

router.get('/:jaratId', async (req, res) => {
  const { jaratId } = req.params;

  if (!jaratId) {
    return res.status(401).send('Nincs megadva járat ID!');
  }
  if (jaratId < 0) {
    return res.status(401).send('Az ID nem lehet negatív!');
  }
  try {
    const jarat = await getJaratById(jaratId);
    if (!jarat) {
      return res.status(401).send('Nincs találat!');
    }
    return res.status(200).send(jarat[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

router.delete('/foglalasTorles/:foglalasId', (req, res) => {
  const { foglalasId } = req.params;
  if (!foglalasId) {
    return res.status(401).send('Nincs megadva foglalás ID!');
  }
  if (foglalasId < 0) {
    return res.status(401).send('Az ID nem lehet negatív!');
  }
  try {
    deleteFoglalas(foglalasId);
    return res.status(200).send('Sikeres törlés!');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

export default router;
