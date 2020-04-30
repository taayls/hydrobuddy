let config;

try {
  config = require('./config/server.config');
} catch (e) {
  console.log(e);
  throw new Error('Missing server configuration file.');
}

const path = require('path');
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const Logger = require('logplease');
const logger = Logger.create('Server', { color: Logger.Colors.Green });

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const controls = require('./controllers/controls');
const relays = require('./controllers/relays');
const system = require('./controllers/system');
const sensors = require('./controllers/sensors');
const motors = require('./controllers/motors');
const api = require('./api');

relays.setup();
system.load();
motors.setup();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

system.events.on('state', function (value) {
  io.sockets.emit('system.state', value);
});

system.events.on('stage', function (value) {
  io.sockets.emit('system.stage', value);
});

system.events.on('override', function (value) {
  io.sockets.emit('system.override', value);
});

const onSerialTimeout = function () {
  logger.error('Arduino serial port has timed out.');
};

const SERIAL_TIMEOUT = 60 * 1000;
const SERIAL_LOG_INTERVAL = 1000 * 60 * 5;
const SerialPort = require('serialport');
const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const serialParser = require('./controllers/serial_parser');
let serialTimeout;

serialport.pipe(serial);
serialport.on('open', () => logger.info('Serial port has been opened.'));
serial.on('data', (message) => {
  const item = serialParser(message);
  serial_received_at = moment();

  if (serialTimeout) clearTimeout(serialTimeout);

  if (!item.type) return;

  io.sockets.emit(item.data.key, item.data.value);

  if (!sensors.isValid(item)) return;

  sensors.evaluate(item);
  controls.evaluate(item);

  serialTimeout = setTimeout(onSerialTimeout, SERIAL_TIMEOUT);
});

setInterval(sensors.record, SERIAL_LOG_INTERVAL);
