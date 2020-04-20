let config;

try {
  config = require('./config/server.config');
} catch (e) {
  console.log(e);
  throw new Error('Missing server configuration file.');
}

const Logger = require('logplease');

const logger = Logger.create('Server');

const fs = require('fs');

const express = require('express');

const app = express();

const http = require('http').createServer(app);

const https = config.ssl
  ? require('https').createServer(
      {
        key: fs.readFileSync(config.ssl_key_path),
        cert: fs.readFileSync(config.ssl_cert_path),
      },
      app
    )
  : null;

function redirectHTTPS(req, res, next) {
  if (req.secure) {
    return next();
  }

  logger.info('Redirecting HTTP connection to HTTPS.');
  res.redirect('https://' + req.hostname + req.url);
}

if (config.ssl_enabled) app.all('*', redirectHTTPS);

http.listen(config.port);

logger.info(`is now listing at: http://hydrobuddy.local:${config.port}`);
