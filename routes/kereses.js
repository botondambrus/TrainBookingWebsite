import { Router } from 'express';
import { keresesJaratok, getJaratok2Atszalassal, getJaratok1Atszalassal } from '../database/jaratok_db.js';

const router = Router();
let role = 'vendeg';
let username = '';

router.use((req, _res, next) => {
  if (req.session.username) {
    role = req.session.role;
    username = req.session.username;
  } else {
    role = 'vendeg';
    username = '';
  }
  next();
});

router.get('/', async (req, res) => {
  let { indulas, erkezes, minimumAr, maximumAr } = req.query;

  if (minimumAr && maximumAr && (minimumAr < 0 || maximumAr < 0)) {
    return res.status(401).send('Az ár nem lehet negatív!');
  }

  indulas = indulas || '';
  erkezes = erkezes || '';
  minimumAr = minimumAr || '';
  maximumAr = maximumAr || '';

  try {
    const jaratok = await keresesJaratok(indulas, erkezes, minimumAr, maximumAr);
    const jaratok2Atszalassal = await getJaratok2Atszalassal(indulas, erkezes, minimumAr, maximumAr);
    const jaratok1Atszalassal = await getJaratok1Atszalassal(indulas, erkezes, minimumAr, maximumAr);

    const jaratokAtszalassal = jaratok1Atszalassal.concat(jaratok2Atszalassal);

    return res.status(200).render('index', {
      jaratok,
      jaratokAtszalassal,
      indulas,
      erkezes,
      minimumAr,
      maximumAr,
      role,
      felhasznalonev: username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Szerver hiba!');
  }
});

export default router;
