let config;

try {
  config = require('./config/server.config');
} catch (e) {
  console.log(e);
  throw new Error('Missing server configuration file.');
}

const Logger = require('logplease');
const logger = Logger.create('Server', { color: Logger.Colors.Green });
const fs = require('fs');
const path = require('path');
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

const io = require('socket.io')(config.ssl_enabled ? https : http);
const api = require('./api');
const relays = require('./controllers/relays');
const serialParser = require('./controllers/serial_parser');
const sensors = require('./controllers/sensors');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  if ('OPTIONS' === req.method || '/ping' === req.path) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api', api);
app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('../client/dist/index.html'));
});

http.listen(config.port, () => {
  logger.info('Web service has started at: http://hydrobuddy.local');
});

io.on('connection', (socket) => {
  logger.debug('Client has connected.');

  socket.on('disconnect', function () {
    logger.debug('Client has disconnected.');
  });
});
