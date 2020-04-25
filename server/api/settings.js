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

router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body.data;

  knex
    .raw(`UPDATE settings SET ${id} = '${data}'`)
    .then((settings) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
