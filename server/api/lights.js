const express = require('express');
const router = express.Router();

const knex = require('../config/db.config').knex;

router.get('/info', (req, res) => {
  const id = req.params.id;

  knex('lights')
    .where('id', 0)
    .then((lights) => {
      res.status(200).json(lights);
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
