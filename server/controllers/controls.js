const server_config = require('../config/server.config.js');
const control_config = require('../config/controls.config.js');
const axios = require('axios');
const moment = require('moment');
const relays = require('./relays');
const motors = require('./motors');

const Logger = require('logplease');
const logger = Logger.create('Controls', { color: Logger.Colors.Cyan });
const logger_record = Logger.create('Nutrients', { color: Logger.Colors.Cyan });

const api = server_config.host + '/api';

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

const nutrient_schedule = function () {
  const nutrient_array = [2, 3, 4, 5, 6, 7];

  nutrient_array.forEach((id) => {
    axios.get(api + '/nutrients/' + id).then((response) => {
      const frequency = response.data[0].frequency;
      const last_dose = response.data[0].last_dose;
      const ml = response.data[0].ml;
      const now = moment();
      const name = response.data[0].name;

      if (response.data[0].ml == 0) {
        return;
      }
      if (response.data[0].frequency == 0) {
        return;
      }

      if (moment(last_dose).isAfter(now.subtract(frequency, 'hours'))) {
        return;
      } else {
        nutrient_pump(response.data[0].id);
      }
    });
  });
};

const nutrient_pump = function (id) {
  switch (id) {
    case 2:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.a.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 3:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.b.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 4:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.c.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 5:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.d.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 6:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.e.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 7:
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      motors.nutrient.f.add();
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    default:
  }
};

const light_schedule = function () {
  axios.get(api + '/lights/info').then((response) => {
    const now = moment();
    const on_time = new moment(response.data[0].on_time, 'H');
    const off_time = new moment(response.data[0].off_time, 'H');

    if (now.isBetween(on_time, off_time, 'minutes')) {
      relays.lights.on();
      logger.info(`Lights are [ON] at ${now}`);
    } else {
      relays.lights.off();
      logger.info(`Lights are [OFF] at ${now}`);
    }
  });
};
module.exports = {
  evaluate: evaluate,
  light_schedule: light_schedule,
  nutrient_schedule: nutrient_schedule,
  nutrient_pump: nutrient_pump,
};
