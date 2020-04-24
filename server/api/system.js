const express = require('express');
const router = express.Router();
const system = require('../controllers/system');
const relays = require('../controllers/relays');

const knex = require('../config/db.config').knex;

router.get('/state', (req, res) => {
  try {
    data = system.getData();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.post('/state', (req, res) => {
  try {
    system.setState(req.body.state);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.post('/stage', (req, res) => {
  try {
    system.setStage(req.body.stage);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/info', (req, res) => {
  const stage = system.getStage().toLowerCase();

  knex('stages')
    .where('name', stage)
    .then((stages) => {
      res.status(200).json(stages);
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.get('/off', (req, res) => {
  try {
    system.setOverride();
    relays.off();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/on', (req, res) => {
  try {
    system.cancelOverride();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
