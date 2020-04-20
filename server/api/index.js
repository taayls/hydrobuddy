const config = require('../config/server.config');
const express = require('express');
const router = express.Router();

const lemdb = require('../config/db.config').lemdb;
const leveldb = require('../config/db.config').leveldb;

const nutrients_router = require('./nutrients');

router.use('/nutrients', nutrients_router);

module.exports = router;
