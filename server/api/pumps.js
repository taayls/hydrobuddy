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

router.get('/run/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.run(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/stop/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.stop(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.get('/calibrate/:id', (req, res) => {
  const id = req.params.id;
  try {
    motors.calibrate(id);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

router.post('/calibrate/:id', (req, res) => {
  const id = req.params.id;
  const current_calibration = 30000;
  const expected_amount = 100;
  const actual_amount = req.body.amount;
  const new_calibration =
    // Calculate motor time per ml
    (current_calibration * (expected_amount / actual_amount)) / 100;

  knex('nutrients')
    .where('id', id)
    .update({ calibration: new_calibration.toFixed(0) })
    .then((response) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
