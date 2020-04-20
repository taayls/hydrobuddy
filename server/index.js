let config;

try {
  config = require('./config/server.config');
} catch (e) {
  console.log(e);
  throw new Error('Missing server configuration file.');
}

const Logger = require('logplease');
const logger = Logger.create('Server');

const express = require('express');
const app = express();
const http = require('http').createServer(app);

http.listen(config.port);

logger.info(`is now listing at: http://hydrobuddy.local:${config.port}`);
