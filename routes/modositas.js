import { Router } from 'express';
import { updateFoglalas, getJaratIdByFoglalas, getFelhasznaloIdByFoglalasId } from '../database/foglalasok_db.js';
import { getNapJarat } from '../database/jaratok_db.js';
import { getFelhasznaloIdByFelhasznalonev } from '../database/felhasznalok_db.js';

const router = Router();

router.post('/:foglalasId', async (req, res) => {
  const { foglalasId } = req.params;
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

  if (!foglalasId) {
    return res.redirect('/foglalas/user?query=errorModositas&message=Nincs megadva foglalás ID!');
  }
  if (foglalasId < 0) {
    return res.redirect('/foglalas/user?query=errorModositas&message=Az ID nem lehet negatív!');
  }
  if (!username) {
    return res.redirect('/foglalas/user?query=errorModositas&message=Nincs bejelentkezve!');
  }
  if (!datum) {
    return res.redirect('/foglalas/user?query=errorModositas&message=Nincs megadva dátum!');
  }
  if (new Date(datum) < maiDatum) {
    return res.redirect('foglalas/user?query=errorModositas&message=A dátum nem lehet korábbi, mint a mai!');
  }

  try {
    const jaratId = await getJaratIdByFoglalas(foglalasId);
    if (jaratId.length === 0) {
      return res.redirect('/foglalas/user?query=errorModositas&message=Nincs ilyen foglalás!');
    }
    const napJarat = await getNapJarat(jaratId[0].jaratId);

    const felhasznaloId = await getFelhasznaloIdByFelhasznalonev(username);
    const felhasznaloIdFoglalas = await getFelhasznaloIdByFoglalasId(foglalasId);

    if (felhasznaloId !== felhasznaloIdFoglalas[0].felhasznaloId) {
      return res.redirect(
        '/foglalas/user?query=errorModositas&message=Hibás felhasználói adatok. A foglalás nem a bejelentkezett felhasználóhoz tartozik!',
      );
    }

    if (napJarat[0].nap !== nap[new Date(datum).getDay()]) {
      return res.redirect(
        '/foglalas/user?query=errorModositas&message=Hibás dátum választás. A járat nem ezen a napon közlekedik!',
      );
    }

    await updateFoglalas(foglalasId, datum);
    return res.redirect('/foglalas/user?query=successModositas');
  } catch (err) {
    console.error(err);
    return res.redirect('/foglalas/user?query=errorModositas');
  }
});

router.get('/:foglalasId', async (req, res) => {
  const { foglalasId } = req.params;
  const { role, username } = req.session;

  if (role === 'vendeg') {
    return res.redirect('/login');
  }

  if (!foglalasId) {
    return res.status(401).send('Nincs megadva járat ID!');
  }

  if (foglalasId < 0) {
    return res.status(401).send('Az ID nem lehet negatív!');
  }

  try {
    const jaratId = await getJaratIdByFoglalas(foglalasId);

    if (jaratId.length === 0) {
      return res.redirect('/foglalas/user?query=errorModositas&message=Nincs ilyen foglalás!');
    }

    const felhasznaloId = await getFelhasznaloIdByFelhasznalonev(username);
    const felhasznaloIdFoglalas = await getFelhasznaloIdByFoglalasId(foglalasId);

    if (felhasznaloId !== felhasznaloIdFoglalas[0].felhasznaloId) {
      return res.redirect(
        '/foglalas/user?query=errorModositas&message=Hibás felhasználói adatok. A foglalás nem a bejelentkezett felhasználóhoz tartozik!',
      );
    }

    return res.render('modositas', { foglalasId, role, felhasznalonev: username });
  } catch (err) {
    console.error(err);
    return res.redirect('/foglalas/user?query=errorModositas');
  }
});

export default router;
