const through = require('through');
const express = require('express');
const router = express.Router();

const lemdb = require('../config/db.config').lemdb;
const leveldb = require('../config/db.config').leveldb;

const lights_router = require('./lights');
const nutrients_router = require('./nutrients');
const pumps_router = require('./pumps');
const settings_router = require('./settings');
const system_router = require('./system');

const state = require('../state.json');
const system = require('../controllers/system');
const relays = require('../controllers/relays');

router.use('/lights', lights_router);
router.use('/nutrients', nutrients_router);
router.use('/pumps', pumps_router);
router.use('/settings', settings_router);
router.use('/system', system_router);

router.get('/info', function (req, res) {
  const result = {
    state: system.getState(),
    stage: state.stage,
    relays: {
      ac: relays.ac.status(),
      lights: relays.lights.status(),
      exhaust_fan: relays.exhaust_fan.status(),
      drain_valve: relays.drain_valve.status(),
      fill_valve: relays.fill_valve.status(),
      drain_pump: relays.drain_pump.status(),
      system_pumps: relays.system_pumps.status(),
    },
  };

  res.status(200).json(result);
});

router.get('/stats/:key', function (req, res) {
  const result = [];
  const start =
    req.query.start && new Date(parseInt(req.query.start, 10)).getTime();
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime();

  lemdb
    .valuestream(req.params.key, {
      start: start,
      end: end,
    })
    .pipe(
      through(
        function (data) {
          result.push({
            timestamp: data.key,
            value: data.value,
          });
        },
        function () {
          res.status(200).json(result);
        }
      )
    );
});

router.delete('/stats/:key/:value', function (req, res) {
  const key = 'values.' + req.params.key + '.' + req.params.value;

  leveldb.del(key, function (err) {
    res
      .status(err ? 500 : 200)
      .json({ message: err ? err.toString() : 'done' });
  });
});

module.exports = router;
