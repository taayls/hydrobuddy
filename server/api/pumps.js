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

module.exports = router;
