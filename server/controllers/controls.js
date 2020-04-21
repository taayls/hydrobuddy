const server_config = require('./config/server.config.js');
const control_config = require('./config/controls.config.js');
const moment = require('moment');
const relays = require('./relays');
const motors = require('./motors');

const evaluate = function (sensor_item) {
  switch (sensor_item.data.key) {
    case 'room.temperature':
      evaluate_temperature(sensor_item.data.value);
      break;

    case 'room.humidity':
      evaluate_humidity(sensor_item.data.value);
      break;

    case 'reservoir.ph':
      evaluate_ph(sensor_item.data.value);
      break;

    case 'reservoir.water_level':
      evaluate_water_level(sensor_item.data.value);
      break;

    default:
  }
};

const evaluate_humidity = function (humidity) {
  if (!control_config.humidity.automate) return;

  if (relays.ac.status()) return relays.exhaust.off();

  if (humidity > control_config.humidity.max) relays.exhaust.on();
  else relays.exhaust.off();
};

const evaluate_temperature = function (temperature) {
  if (temperature >= control_config.temperature.max) {
    relays.ac.on();
    relays.exhaust.off();
  } else if (temperature < control_config.temperature.min) {
    relays.ac.off();
  }
};

module.exports = {
  evaluate: evaluate,
};
