let config;

try {
  config = require('./config/server.config');
} catch (e) {
  console.log(e);
  throw new Error('Missing server configuration file.');
}

const fs = require('fs');
const SerialPort = require('serialport');
const path = require('path');
const express = require('express');
const Logger = require('logplease');
const logger = Logger.create('Server', { color: Logger.Colors.Green });

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);

const relays = require('./controllers/relays');
const serialParser = require('./controllers/serial_parser');
const sensors = require('./controllers/sensors');
const api = require('./api');

relays.setup();

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

relays.events.on('change', (type, status) => {
  io.sockets.emit(type, status);
});

const onSerialTimeout = function () {
  logger.error('Arduino serial port has timed out.');
};

let serialTimeout;
const SERIAL_TIMEOUT = 60 * 1000;
const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
const serialport = new SerialPort('/dev/ttyAMA0', { baudRate: 9600 });

serialport.pipe(serial);
serialport.on('open', () =>
  logger.info('Arduino serial port has been opened.')
);
serial.on('data', (message) => {
  const item = serialParser(message);

  if (serialTimeout) clearTimeout(serialTimeout);

  if (!item.type) return;
  io.sockets.emit(item.data.key, item.data.value);
  if (!sensors.isValid(item)) return;
  sensors.evaluate(item);
  if (config.automate && !system.isOverrided()) control.evaluate(item);

  serialTimeout = setTimeout(onSerialTimeout, SERIAL_TIMEOUT);
});
