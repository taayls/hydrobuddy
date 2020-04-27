const express = require('express');
const router = express.Router();
const relays = require('../controllers/relays');
const controls = require('../controllers/controls');
const system = require('../controllers/system');

const Logger = require('logplease');
const logger = Logger.create('Manual', { color: Logger.Colors.Blue });

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
      logger.info('Lights set back to AUTO');
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
      logger.info('Manually turned lights ON');
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
      logger.info('Manually turned lights OFF');
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.post('/update/:id', (req, res) => {
  const id = req.params.id;

  knex('stages')
    .where('name', id)
    .update({ lights_on: req.body.lights_on, lights_off: req.body.lights_off })
    .then((settings) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
