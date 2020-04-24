const express = require('express');
const router = express.Router();

const knex = require('../config/db.config').knex;

router.get('/info', (req, res) => {
  knex('settings')
    .where('id', 0)
    .then((settings) => {
      res.status(200).json(settings);
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
