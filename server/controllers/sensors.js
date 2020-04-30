const config = require('../config/sensors.config');
const lemdb = require('../config/db.config').lemdb;
const Logger = require('logplease');
const logger = Logger.create('Sensors', { color: Logger.Colors.Magenta });

let sensor_data = {
  'reservoir.ph': [],
  'reservoir.ec': [],
  'reservoir.water_level': [],
  'reservoir.temperature': [],
  'room.humidity': [],
  'room.temperature': [],
  'room.infrared_spectrum': [],
  'room.full_spectrum': [],
  'room.visible_spectrum': [],
  'room.illuminance': [],
};

const getAverage = function (key) {
  let total = 0;
  let values = sensor_data[key];

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  return (total / values.length).toFixed(1);
};

const record = function () {
  Object.keys(sensor_data).forEach(function (data_key, index) {
    const average = getAverage(data_key);
    lemdb.recorder(data_key)(average);
    sensor_data[data_key] = [];
    logger.info('Sensor data saved to database.');
  });
};

const evaluate = function (sensor_item) {
  sensor_data[sensor_item.data.key].push(sensor_item.data.value);
};

const isValid = function (sensor_item) {
  const limits = config.sensors[sensor_item.type];

  if (limits) {
    if (sensor_item.data.value < limits.min) return false;

    if (sensor_item.data.value > limits.max) return false;
  }

  if (!sensor_data[sensor_item.data.key].length) return true;

  const average = getAverage(sensor_item.data.key);

  if (parseInt(average, 10) === 0) return true;

  return Math.abs(((sensor_item.data.value - average) / average) * 100) < 20;
};

module.exports = {
  evaluate: evaluate,
  isValid: isValid,
  record: record,
};
