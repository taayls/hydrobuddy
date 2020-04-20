const config = require('../config/motors.config');
const motorHatOne = require('motor-hat')(config.motor_hat_one);
const motorHatTwo = require('motor-hat')(config.motor_hat_two);
const Logger = require('logplease');
const logger = Logger.create('Motors');

motorHatOne.init();
motorHatTwo.init();

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

  purge: function () {
    logger.info('Purging all motors for 10 seconds.');
    motors.run_all();
    setInterval(motors.stop_all(), 10000);
  },

  pH: {
    up: {
      motor: motorHatOne.dcs[0],
      //TODO: Get name from database
      name: 'PH Up',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    down: {
      motor: motorHatOne.dcs[1],
      //TODO: Get name from database
      name: 'PH Down',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
  },

  nutrient: {
    a: {
      motor: motorHatOne.dcs[2],
      //TODO: Get name from database
      name: 'Nutrient A',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    b: {
      motor: motorHatOne.dcs[3],
      //TODO: Get name from database
      name: 'Nutrient B',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    c: {
      motor: motorHatTwo.dcs[0],
      //TODO: Get name from database
      name: 'Nutrient C',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    d: {
      motor: motorHatOne.dcs[1],
      //TODO: Get name from database
      name: 'Nutrient D',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    e: {
      motor: motorHatOne.dcs[2],
      //TODO: Get name from database
      name: 'Nutrient E',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
    f: {
      motor: motorHatOne.dcs[3],
      //TODO: Get name from database
      name: 'Nutrient F',
      //TODO: Get amount of ml from database
      ml: 1,
      //TODO: Get calibration time per ml from database
      calibration: 1500,
      add: function (value) {
        const name = this.name;
        const amount = this.ml;
        const time = this.calibration * amount;

        logger.info(`Adding ${amount}ML of ${name}.`);

        this.motor.runSync('fwd');
        setTimeout(this.motor.stopSync(), time);
      },
    },
  },
};

module.exports = motors;
