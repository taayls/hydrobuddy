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
      if (system.getState() !== 'RUNNING') return;
      evaluate_temperature(sensor_item.data.value);
      break;

    case 'room.humidity':
      if (system.getState() !== 'RUNNING') return;
      evaluate_humidity(sensor_item.data.value);
      break;

    case 'reservoir.ph':
      if (system.getState() !== 'RUNNING') return;
      evaluate_ph(sensor_item.data.value);
      break;

    case 'reservoir.ec':
      if (system.getState() !== 'RUNNING') return;
      evaluate_ec(sensor_item.data.value);
      break;

    case 'reservoir.water_level':
      evaluate_water_level(sensor_item.data.value);
      break;

    default:
  }
};

const evaluate_humidity = function (humidity) {
  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_humidity;

    if (!automate) return;
    axios.get(api + '/system/info').then((response) => {
      const max_humidity = response.data[0].max_humidity;

      if (humidity > max_humidity) relays.exhaust_fan.on();
      logger.info(`Exhaust fan turned on. Humidity: ${humidity}`);
    });
  });
};

const evaluate_temperature = function (temperature) {
  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_temp;
    const temp_min = response.data[0].temp_min;
    const temp_max = response.data[0].temp_max;

    if (!automate) return;

    if (temperature >= temp_max) {
      relays.exhaust_fan.on();
      logger.info(`Exhaust fan turned on. Temperature: ${temperature}`);
    } else if (temperature < temp_min) {
      relays.exhaust_fan.off();
      logger.info(`Exhaust fan turned off. Temperature: ${temperature}`);
    }
  });
};

const evaluate_ph = function (ph) {
  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_ph;
    const ph_min = response.data[0].ph_min;
    const ph_max = response.data[0].ph_max;

    if (!automate) return;
    axios.get(api + '/nutrients/2').then((response) => {
      const last_nutrients = response.data[0].last_dose;
      const now = moment();

      // Wait 45mins after last nutrient dose before trying to PH UP/DOWN.
      if (moment(last_nutrients).isAfter(now.subtract(45, 'minutes'))) return;

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
  });
};

const evaluate_ec = function (ec) {
  axios.get(api + '/system/info').then((response) => {
    const ec_low = response.data[0].ec_target_low;
    const ec_high = response.data[0].ec_target_high;

    if (ec > ec_high) {
      // If EC is higher than EC Target HIGH drain some water then refill with normal water
      axios.get(api + '/nutrients/' + id).then((response) => {
        const last_dose = response.data[0].last_dose;
        const now = moment();

        // If has not been 60 mins since last dose do not drain any water
        if (moment(last_dose).isAfter(now.subtract(60, 'minutes'))) return;

        // If draining/filling already return
        if (
          relays.drain_valve.status() ||
          relays.drain_pump.status() ||
          relays.fill_valve.status()
        )
          return;

        // Open drain valve/pump
        relays.drain_valve.on();
        relays.drain_pump.on();

        // Drain water for 60 seconds then turn pump/valve off. System will auto fill to level afterwards.
        setTimeout(() => {
          relays.drain_pump.off();
          relays.drain_valve.off();
        }, 60000);
      });
    } else if (ec < ec_low) {
      // If EC is lower EC Target LOW add 10% of normal nutrient dose (doses spaces 2mins apart)
      const id_array = [2, 3, 4, 5, 6, 7];

      id_array.forEach((id) => {
        setTimeout(() => {
          axios.get(api + '/nutrients/' + id).then((response) => {
            const last_dose = response.data[0].last_dose;
            const tag = response.data[0].tag;
            const now = moment();

            // If has not been 60 mins since last dose do not add more
            if (moment(last_dose).isAfter(now.subtract(60, 'minutes'))) return;

            axios.get(api + '/nutrients/info/' + tag).then((response) => {
              const amount = response.data[0][tag] * 0.1;
              if (response.data[0][tag] == 0) {
                return;
              }
              nutrient_pump(id, amount);
            });
          });
        }, 120000 * id);
      });
    }
  });
};

const evaluate_water_level = function (water_level) {
  axios.get(api + '/settings/info').then((response) => {
    const automate = response.data[0].automate_water_level;
    const level_min = response.data[0].water_level_min;
    const level_max = response.data[0].water_level_max;
    const grow_level = response.data[0].water_grow_level;
    const pump_limit = response.data[0].water_pump_limit;
    const drain_limit = response.data[0].water_pump_limit;

    if (system.getState() === 'RUNNING') {
      relays.drain_pump.off();

      if (!automate) {
        relays.fill_valve.off();
        relays.drain_valve.off();
        return;
      }

      if (water_level < level_max) {
        relays.drain_valve.on();
      } else if (water_level > grow_level) {
        relays.fill_valve.on();
      } else {
        relays.fill_valve.off();
        relays.drain_valve.off();
      }

      return;
    }

    if (water_level > pump_limit) relays.system_pumps.off();
    else relays.system_pumps.on();

    if (system.getState() === 'DRAINING') {
      if (water_level >= level_min) {
        system.setState('FILLING');
        relays.drain_valve.off();
        relays.drain_pump.off();
        relays.fill_valve.on();
      } else {
        relays.drain_valve.on();
        relays.drain_pump.on();
        relays.fill_valve.off();
      }
    } else if (system.getState() === 'FILLING') {
      if (system.getDrainCycle() < 2 && water_level <= drain_limit) {
        system.setState('DRAINING');
        system.increaseDrainCycle();
        relays.drain_valve.on();
        relays.drain_pump.on();
        relays.fill_valve.off();
      } else if (water_level <= level_max) {
        system.setState('RUNNING');
        system.resetDrainCycle();
        relays.fill_valve.off();
        nutrient_program();
      } else {
        relays.fill_valve.on();
        relays.drain_valve.off();
        relays.drain_pump.off();
      }
    }
  });
};

const nutrient_program = function () {
  if (system.getState() !== 'RUNNING') return;
  // Go through each nutrient, adding dose specified for each stage. Doses are spaced apart 5 minutes to allow mixing
  const id_array = [2, 3, 4, 5, 6, 7];

  id_array.forEach((id) => {
    setTimeout(() => {
      axios.get(api + '/nutrients/' + id).then((response) => {
        const tag = response.data[0].tag;

        axios.get(api + '/nutrients/info/' + tag).then((response) => {
          if (response.data[0][tag] == 0) {
            return;
          }
          nutrient_pump(id, response.data[0][tag]);
        });
      });
    }, 300000 * id);
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
  axios.get(api + '/settings/info').then((response) => {
    if (response.data[0].lights_automate === false) return;

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
  });
};

module.exports = {
  evaluate: evaluate,
  evaluate_water_level: evaluate_water_level,
  light_schedule: light_schedule,
  nutrient_program: nutrient_program,
  nutrient_pump: nutrient_pump,
  evaluate_ph: evaluate_ph,
};
