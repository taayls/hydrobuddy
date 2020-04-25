const express = require('express');
const router = express.Router();
const motors = require('../controllers/motors');

const knex = require('../config/db.config').knex;

router.get('/prime', (req, res) => {
  try {
    motors.prime();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/run_one/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.run_one(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/stop_one/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.stop_one(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/run_two/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.run_two(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/stop_two/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.stop_two(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/calibrate_one/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.calibrate_one(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/calibrate_two/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.calibrate_two(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
