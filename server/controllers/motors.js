const axios = require('axios');
const config = require('../config/motors.config');
const server_config = require('../config/server.config');
const motorHatOne = require('motor-hat')(config.motor_hat_one.hat_config);
const motorHatTwo = require('motor-hat')(config.motor_hat_two.hat_config);
const Logger = require('logplease');
const logger = Logger.create('Nutrients', { color: Logger.Colors.Cyan });

const api = server_config.host + '/api';

if (!server_config.test) {
  motorHatOne.init();
  motorHatTwo.init();
}

const motors = {
  setup: function () {
    if (!server_config.test) {
      motorHatOne.dcs[0].setSpeedSync(config.motor_hat_one.motor_config.speed);
      motorHatOne.dcs[1].setSpeedSync(config.motor_hat_one.motor_config.speed);
      motorHatOne.dcs[2].setSpeedSync(config.motor_hat_one.motor_config.speed);
      motorHatOne.dcs[3].setSpeedSync(config.motor_hat_one.motor_config.speed);
      motorHatTwo.dcs[0].setSpeedSync(config.motor_hat_two.motor_config.speed);
      motorHatTwo.dcs[1].setSpeedSync(config.motor_hat_two.motor_config.speed);
      motorHatTwo.dcs[2].setSpeedSync(config.motor_hat_two.motor_config.speed);
      motorHatTwo.dcs[3].setSpeedSync(config.motor_hat_two.motor_config.speed);
    }
  },
  run: function (id) {
    switch (id) {
      case 0:
        motorHatOne.dcs[0].runSync('fwd');
        break;
      case 1:
        motorHatOne.dcs[1].runSync('fwd');
        break;
      case 2:
        motorHatOne.dcs[2].runSync('fwd');
        break;
      case 3:
        motorHatOne.dcs[3].runSync('fwd');
        break;
      case 4:
        motorHatTwo.dcs[0].runSync('fwd');
        break;
      case 5:
        motorHatTwo.dcs[1].runSync('fwd');
        break;
      case 6:
        motorHatTwo.dcs[2].runSync('fwd');
        break;
      case 7:
        motorHatTwo.dcs[3].runSync('fwd');
        break;
      default:
    }
  },
  stop: function (id) {
    switch (id) {
      case 0:
        motorHatOne.dcs[0].stopSync();
        break;
      case 1:
        motorHatOne.dcs[1].stopSync();
        break;
      case 2:
        motorHatOne.dcs[2].stopSync();
        break;
      case 3:
        motorHatOne.dcs[3].stopSync();
        break;
      case 4:
        motorHatTwo.dcs[0].stopSync();
        break;
      case 5:
        motorHatTwo.dcs[1].stopSync();
        break;
      case 6:
        motorHatTwo.dcs[2].stopSync();
        break;
      case 7:
        motorHatTwo.dcs[3].stopSync();
        break;
      default:
    }
  },
  calibrate: function (id) {
    this.run(id);
    setInterval(this.stop(id), 30000);
  },
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
      add: function (amount) {
        axios.get(api + '/nutrients/0').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    down: {
      motor: motorHatOne.dcs[1],
      add: function (amount) {
        axios.get(api + '/nutrients/1').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
  },

  nutrient: {
    a: {
      motor: motorHatOne.dcs[2],
      add: function (amount) {
        axios.get(api + '/nutrients/2').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    b: {
      motor: motorHatOne.dcs[3],
      add: function (amount) {
        axios.get(api + '/nutrients/3').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    c: {
      motor: motorHatTwo.dcs[0],
      add: function (amount) {
        axios.get(api + '/nutrients/4').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    d: {
      motor: motorHatTwo.dcs[1],
      add: function (amount) {
        axios.get(api + '/nutrients/5').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    e: {
      motor: motorHatTwo.dcs[2],
      add: function (amount) {
        axios.get(api + '/nutrients/6').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
    f: {
      motor: motorHatTwo.dcs[3],
      add: function (amount) {
        axios.get(api + '/nutrients/7').then((response) => {
          const name = response.data[0].name;
          const time = response.data[0].calibration * amount;

          logger.info(`Adding ${amount} ML of ${name}.`);

          this.motor.runSync('fwd');
          setTimeout(this.motor.stopSync(), time);
        });
      },
    },
  },
};

module.exports = motors;
