const express = require('express');
const router = express.Router();
const relays = require('../controllers/relays');
const controls = require('../controllers/controls');
const system = require('../controllers/system');

const knex = require('../config/db.config').knex;

router.get('/info', (req, res) => {
  const stage = system.getStage().toLowerCase();

  knex('stages')
    .where('name', stage)
    .then((lights) => {
      res.status(200).json(lights);
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.get('/auto', (req, res) => {
  try {
    system.cancelOverride();
    controls.light_schedule();
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/on', (req, res) => {
  try {
    system.setOverride();
    relays.lights.on();
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/off', (req, res) => {
  try {
    system.setOverride();
    relays.lights.off();
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
