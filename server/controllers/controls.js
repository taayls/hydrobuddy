const server_config = require('../config/server.config.js');
const control_config = require('../config/controls.config.js');
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

const evaluate_ph = function (ph) {
  if (system.getState() !== 'RUNNING') return;

  axios.get(api + '/nutrients/0').then((response) => {
    const last_dose = response.data[0].last_dose;
    const now = moment();
    const now_sql = moment().format('YYYY-MM-DD HH:mm:ss');

    if (moment(last_dose).isAfter(now.subtract(30, 'minutes'))) {
      return;
    } else if (ph < control_config.ph.min) {
      axios
        .post(api + '/nutrients/last_dose/0', {
          last_dose: now_sql,
        })
        .then(function (response) {
          motors.pH.up.add();
          console.log('done');
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
    } else if (ph > control_config.ph.min) {
      axios
        .post(api + '/nutrients/last_dose/1', {
          last_dose: now_sql,
        })
        .then(function (response) {
          motors.pH.down.add();
          console.log('done');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
};

const evaluate_water_level = function (water_level) {
  if (system.getState() === 'RUNNING') {
    relays.drain_pump.off();

    if (!control_config.water_level.automate) {
      relays.fill_valve.off();
      relays.drain_valve.off();
      return;
    }

    if (water_level < control_config.water_level.max) {
      relays.drain_valve.on();
    } else if (water_level > config.water_level.grow_limit) {
      relays.fill_valve.on();
    } else {
      relays.fill_valve.off();
      relays.drain_valve.off();
    }

    return;
  }
};

const nutrient_schedule = function () {
  if (system.getState() !== 'RUNNING') return;

  const nutrient_array = [2, 3, 4, 5, 6, 7];

  nutrient_array.forEach((id) => {
    axios.get(api + '/nutrients/' + id).then((response) => {
      const frequency = response.data[0].frequency;
      const last_dose = response.data[0].last_dose;
      const now = moment();

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
  const now_sql = moment().format('YYYY-MM-DD HH:mm:ss');
  switch (id) {
    case 2:
      motors.nutrient.a.add();
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
      motors.nutrient.b.add();
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
      motors.nutrient.c.add();
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
      motors.nutrient.d.add();
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
      motors.nutrient.e.add();
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
      motors.nutrient.f.add();
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
  nutrient_schedule: nutrient_schedule,
  nutrient_pump: nutrient_pump,
  evaluate_ph: evaluate_ph,
};
