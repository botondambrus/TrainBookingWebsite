import { Router } from 'express';
import { insertFoglalas, getFoglalasByUser } from '../database/foglalasok_db.js';
import { getFelhasznaloIdByFelhasznalonev } from '../database/felhasznalok_db.js';
import { getAllByJaratId, getNapJarat } from '../database/jaratok_db.js';

const router = Router();

router.post('/jarat/:jaratId', async (req, res) => {
  const { jaratId } = req.params;
  const { datum } = req.body;
  const { username } = req.session;

  const maiDatum = new Date();
  const nap = {
    0: 'vasarnap',
    1: 'hetfo',
    2: 'kedd',
    3: 'szerda',
    4: 'csutortok',
    5: 'pentek',
    6: 'szombat',
  };

  maiDatum.setHours(0, 0, 0, 0);

  if (!jaratId) {
    return res.redirect('/foglalas/user?query=error&message=Nincs megadva járat ID!');
  }
  if (jaratId < 0) {
    return res.redirect('/foglalas/user?query=error&message=Az ID nem lehet negatív!');
  }
  if (!username) {
    return res.redirect('/foglalas/user?query=error&message=Nincs bejelentkezve!');
  }
  if (!datum) {
    return res.redirect('/foglalas/user?query=error&message=Nincs megadva dátum!');
  }
  if (new Date(datum) < maiDatum) {
    return res.redirect('/foglalas/user?query=error&message=A dátum nem lehet korábbi, mint a mai!');
  }

  try {
    const napJarat = await getNapJarat(jaratId);

    if (napJarat[0].nap !== nap[new Date(datum).getDay()]) {
      return res.redirect(
        '/foglalas/user?query=error&message=Hibás dátum választás. A járat nem ezen a napon közlekedik!',
      );
    }
    const felhasznaloId = await getFelhasznaloIdByFelhasznalonev(username);
    await insertFoglalas(jaratId, felhasznaloId, datum);
    return res.redirect('/foglalas/user?query=success');
  } catch (err) {
    console.error(err);
    return res.redirect('/foglalas/user?query=error');
  }
});

router.get('/user', async (req, res) => {
  const { username, role } = req.session;
  const { query, message } = req.query;

  if (!username) {
    return res.redirect('/login');
  }
  try {
    const foglalasok = await getFoglalasByUser(username);
    return res.render('foglalasUser', { foglalasok, role, felhasznalonev: username, query, message });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

router.get('/jarat/:jaratId', async (req, res) => {
  const { jaratId } = req.params;
  const { role, username } = req.session;

  if (role === 'vendeg') {
    return res.redirect('/login');
  }

  if (!jaratId) {
    return res.status(401).send('Nincs megadva járat ID!');
  }

  if (jaratId < 0) {
    return res.status(401).send('Az ID nem lehet negatív!');
  }

  try {
    const jaratAdatai = await getAllByJaratId(jaratId);
    if (jaratAdatai.length === 0) {
      return res.status(401).send('Nincs ilyen járat!');
    }
    return res.render('foglalasJarat', { jaratId, role, felhasznalonev: username });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

router.get('/jaratok/:jaratokId', (req, res) => {
  const { jaratokId } = req.params;
  const { role, username } = req.session;

  if (role === 'vendeg') {
    return res.redirect('/login');
  }

  if (!jaratokId) {
    return res.status(401).send('Nincs megadva járat ID!');
  }

  return res.render('foglalasJaratok', { jaratokId, role, felhasznalonev: username });
});

router.post('/jaratok/:jaratokId', async (req, res) => {
  const { jaratokId } = req.params;
  const { datum } = req.body;
  const { username } = req.session;

  const maiDatum = new Date();
  const nap = {
    0: 'vasarnap',
    1: 'hetfo',
    2: 'kedd',
    3: 'szerda',
    4: 'csutortok',
    5: 'pentek',
    6: 'szombat',
  };

  maiDatum.setHours(0, 0, 0, 0);

  if (!jaratokId) {
    return res.redirect('/foglalas/user?query=error&message=Nincs megadva járat ID!');
  }
  if (!username) {
    return res.redirect('/foglalas/user?query=error&message=Nincs bejelentkezve!');
  }
  if (new Date(datum) < maiDatum) {
    return res.redirect('/foglalas/user?query=error&message=A dátum nem lehet korábbi, mint a mai!');
  }

  const jaratokIdTomb = jaratokId.split('->');

  for (let i = 0; i < jaratokIdTomb.length; i++) {
    if (jaratokIdTomb[i] < 0) {
      return res.redirect('/foglalas/user?query=error&message=Az ID nem lehet negatív!');
    }
  }

  try {
    const felhasznaloId = await getFelhasznaloIdByFelhasznalonev(username);
    const napJarat0 = await getNapJarat(jaratokIdTomb[0]);
    const napJarat1 = await getNapJarat(jaratokIdTomb[1]);

    if (napJarat0[0].nap !== nap[new Date(datum).getDay()] || napJarat1[0].nap !== nap[new Date(datum).getDay()]) {
      return res.redirect(
        '/foglalas/user?query=error&message=Hibás dátum választás. A járatok nem ezen a napon közlekednek!',
      );
    }

    if (jaratokIdTomb.length === 2) {
      await insertFoglalas(jaratokIdTomb[0], felhasznaloId, datum);
      await insertFoglalas(jaratokIdTomb[1], felhasznaloId, datum);
    }

    if (jaratokIdTomb.length === 3) {
      const napJarat2 = await getNapJarat(jaratokIdTomb[2]);

      if (napJarat2[0].nap !== nap[new Date(datum).getDay()]) {
        return res.redirect(
          '/foglalas/user?query=error&message=Hibás dátum választás. A járatok nem ezen a napon közlekednek!',
        );
      }

      await insertFoglalas(jaratokIdTomb[0], felhasznaloId, datum);
      await insertFoglalas(jaratokIdTomb[1], felhasznaloId, datum);
      await insertFoglalas(jaratokIdTomb[2], felhasznaloId, datum);
    }
    return res.redirect('/foglalas/user?query=success');
  } catch (err) {
    console.error(err);
    return res.redirect('/foglalas/user?query=error');
  }
});

export default router;
