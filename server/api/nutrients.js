const express = require('express');
const router = express.Router();

const knex = require('../config/db.config').knex;

router.get('/:id', (req, res) => {
  const id = req.params.id;

  knex('nutrients')
    .where('id', id)
    .then((nutrients) => {
      res.status(200).json(nutrients);
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

router.post('/last_dose/:id', (req, res) => {
  const id = req.params.id;

  knex('nutrients')
    .where('id', id)
    .update({ last_dose: req.body.last_dose })
    .then((nutrients) => {
      res.status(200).json({ message: 'Successfully Updated' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
});

module.exports = router;
