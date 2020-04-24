const config = require('../config/server.config');
const express = require('express');
const router = express.Router();

const lemdb = require('../config/db.config').lemdb;
const leveldb = require('../config/db.config').leveldb;

const lights_router = require('./lights');
const nutrients_router = require('./nutrients');
const settings_router = require('./settings');
const system_router = require('./system');

router.use('/lights', lights_router);
router.use('/nutrients', nutrients_router);
router.use('/settings', settings_router);
router.use('/system', system_router);

module.exports = router;
