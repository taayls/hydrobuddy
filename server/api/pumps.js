const express = require('express');
const router = express.Router();
const axios = require('axios');
const server_config = require('../config/server.config.js');
const motors = require('../controllers/motors');
const api = server_config.host + '/api';

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

router
  .post('/calibrate/:id', (req, res) => {
    const id = req.params.id;
    const current_calibration = 30000;
    const expected_amount = 100;
    const actual_amount = req.body.amount;
    const new_calibration =
      // Calculate motor time per ml
      current_calibration * (expected_amount / actual_amount);

    knex('nutrients')
      .where('id', id)
      .update({ calibration: new_calibration.toFixed(0) })
      .then((response) => {
        res.status(200).json({ message: 'success' });
      })
      .catch((err) => {
        res.status(500).json({ message: err.toString() });
      });
  })
  .catch((err) => {
    res.status(500).json({ message: err.toString() });
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
