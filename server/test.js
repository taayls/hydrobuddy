const Logger = require('logplease');
const logger = Logger.create('pumps');

const pumps = require('./controllers/motors');

logger.info('Starting Pump');
pumps.pH.up.add();
