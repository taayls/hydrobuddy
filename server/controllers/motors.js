const axios = require('axios');
const config = require('../config/motors.config');
const server_config = require('../config/server.config');
const motorHatOne = require('motor-hat')(config.motor_hat_one);
const motorHatTwo = require('motor-hat')(config.motor_hat_two);
const Logger = require('logplease');
const logger = Logger.create('Motors', { color: Logger.Colors.Cyan });

const api = server_config.host + '/api';

if (!server_config.test) {
  motorHatOne.init();
  motorHatTwo.init();
}

const motors = {
  run_all: function () {
    motorHatOne.dcs[0].runSync('fwd');
    motorHatOne.dcs[1].runSync('fwd');
    motorHatOne.dcs[2].runSync('fwd');
    motorHatOne.dcs[3].runSync('fwd');
    motorHatTwo.dcs[0].runSync('fwd');
    motorHatTwo.dcs[1].runSync('fwd');
    motorHatTwo.dcs[2].runSync('fwd');
    motorHatTwo.dcs[3].runSync('fwd');
  },

  stop_all: function () {
    motorHatOne.dcs[0].stopSync();
    motorHatOne.dcs[1].stopSync();
    motorHatOne.dcs[2].stopSync();
    motorHatOne.dcs[3].stopSync();
    motorHatTwo.dcs[0].stopSync();
    motorHatTwo.dcs[1].stopSync();
    motorHatTwo.dcs[2].stopSync();
    motorHatTwo.dcs[3].stopSync();
  },

  prime: function () {
    logger.info('Priming all motors for 10 seconds.');
    motors.run_all();
    setInterval(motors.stop_all(), 10000);
  },

  pH: {
    up: {
      motor: motorHatOne.dcs[0],
      add: function () {
        axios.get(api + '/nutrients/0').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    down: {
      motor: motorHatOne.dcs[1],
      add: function () {
        axios.get(api + '/nutrients/1').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
  },

  nutrient: {
    a: {
      motor: motorHatOne.dcs[2],
      calibration: 1500,
      add: function () {
        axios.get(api + '/nutrients/2').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    b: {
      motor: motorHatOne.dcs[3],
      add: function () {
        axios.get(api + '/nutrients/3').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    c: {
      motor: motorHatTwo.dcs[0],
      add: function () {
        axios.get(api + '/nutrients/4').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    d: {
      motor: motorHatTwo.dcs[1],
      add: function () {
        axios.get(api + '/nutrients/5').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    e: {
      motor: motorHatTwo.dcs[2],
      add: function () {
        axios.get(api + '/nutrients/6').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    f: {
      motor: motorHatTwo.dcs[3],
      add: function () {
        axios.get(api + '/nutrients/7').then((response) => {
          const name = response.data[0].name;
          const amount = response.data[0].ml;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount}ml of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
  },
};

module.exports = motors;
