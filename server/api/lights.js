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
  knex('settings')
    .where('id', 0)
    .update({ automate_lights: 'true' })
    .then((settings) => {
      controls.light_schedule();
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.get('/on', (req, res) => {
  knex('settings')
    .where('id', 0)
    .update({ automate_lights: 'false' })
    .then((settings) => {
      relays.lights.on();
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.get('/off', (req, res) => {
  knex('settings')
    .where('id', 0)
    .update({ automate_lights: 'false' })
    .then((settings) => {
      relays.lights.off();
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
