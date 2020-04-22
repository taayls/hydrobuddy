const express = require('express');
const router = express.Router();
const motors = require('../controllers/motors');
const system = require('../controllers/system');
const relays = require('../controllers/relays');

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

router.get('/override', (req, res) => {
  try {
    system.setOverride();
    system.setState('STOPPED');
    relays.off();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/cancel_override', (req, res) => {
  try {
    system.cancelOverride();
    system.setState('RUNNING');
    relays.setup();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/purge', (req, res) => {
  try {
    motors.prime();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
