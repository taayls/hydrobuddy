const server_config = require('../config/server.config.js');
const axios = require('axios');
const moment = require('moment');
const relays = require('./relays');
const motors = require('./motors');
const system = require('./system');

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
  if (system.getState() !== 'RUNNING') return;

  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_humidity;

    if (!automate) return;
    if (relays.ac.status()) return relays.exhaust.off();

    axios.get(api + '/system/info').then((response) => {
      const max_humidity = response.data[0].max_humidity;

      if (humidity > max_humidity) relays.exhaust.on();
      else relays.exhaust.off();
    });
  });
};

const evaluate_temperature = function (temperature) {
  if (system.getState() !== 'RUNNING') return;

  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_temp;
    const temp_min = response.data[0].temp_min;
    const temp_max = response.data[0].temp_max;

    if (!automate) return;

    if (temperature >= temp_max) {
      relays.ac.on();
      relays.exhaust.off();
    } else if (temperature < temp_min) {
      relays.ac.off();
    }
  });
};

const evaluate_ph = function (ph) {
  if (system.getState() !== 'RUNNING') return;

  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_ph;
    const ph_min = response.data[0].ph_min;
    const ph_max = response.data[0].ph_max;

    if (!automate) return;

    axios.get(api + '/nutrients/0').then((response) => {
      const last_dose = response.data[0].last_dose;
      const now = moment();
      const now_sql = moment().format('YYYY-MM-DD HH:mm:ss');

      if (moment(last_dose).isAfter(now.subtract(30, 'minutes'))) {
        return;
      } else if (ph < ph_min) {
        axios
          .post(api + '/nutrients/last_dose/0', {
            last_dose: now_sql,
          })
          .then(function (response) {
            motors.pH.up.add();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });

    axios.get(api + '/nutrients/1').then((response) => {
      const last_dose = response.data[0].last_dose;
      const now = moment();
      const now_sql = moment().format('YYYY-MM-DD HH:mm:ss');

      if (moment(last_dose).isAfter(now.subtract(30, 'minutes'))) {
        return;
      } else if (ph > ph_max) {
        axios
          .post(api + '/nutrients/last_dose/1', {
            last_dose: now_sql,
          })
          .then(function (response) {
            motors.pH.down.add();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  });
};

const nutrient_program = function () {
  if (system.getState() !== 'RUNNING') return;

  const id_array = [2, 3, 4, 5, 6, 7];

  id_array.forEach((id) => {
    axios.get(api + '/nutrients/' + id).then((response) => {
      const tag = response.data[0].tag;

      axios.get(api + '/nutrients/info/' + tag).then((response) => {
        if (response.data[0][tag] == 0) {
          return;
        }
        nutrient_pump(id, response.data[0][tag]);
      });
    });
  });
};

const nutrient_pump = function (id, amount) {
  const now_sql = moment().format('YYYY-MM-DD HH:mm:ss');
  switch (id) {
    case 2:
      motors.nutrient.a.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 3:
      motors.nutrient.b.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 4:
      motors.nutrient.c.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 5:
      motors.nutrient.d.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 6:
      motors.nutrient.e.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
        })
        .then(function (response) {
          logger_record.info('Nutrient added.');
        })
        .catch(function (error) {
          logger_record.info(error);
        });
      break;
    case 7:
      motors.nutrient.f.add(amount);
      axios
        .post(api + '/nutrients/last_dose/' + id, {
          last_dose: now_sql,
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
  if (system.getState() !== 'RUNNING') return;
  if (system.isOverridden() === true) return;

  axios.get(api + '/lights/info').then((response) => {
    const now = moment();
    const on_time = new moment(response.data[0].lights_on, 'H');
    const off_time = new moment(response.data[0].lights_off, 'H');

    if (now.isBetween(on_time, off_time, 'minutes')) {
      if (relays.lights.status() == 0) {
        logger.info(`Lights turned [ON] at ${now}`);
      }
      relays.lights.on();
    } else {
      if (relays.lights.status() == 1) {
        logger.info(`Lights turned [OFF] at ${now}`);
      }
      relays.lights.off();
    }
  });
};
module.exports = {
  evaluate: evaluate,
  light_schedule: light_schedule,
  nutrient_program: nutrient_program,
  nutrient_pump: nutrient_pump,
  evaluate_ph: evaluate_ph,
};
