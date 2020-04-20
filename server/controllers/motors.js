const config = require('../config/motors.config');
const motorHatOne = require('motor-hat')(config.motor_hat_one);
const motorHatTwo = require('motor-hat')(config.motor_hat_two);
const Logger = require('logplease');
const logger = Logger.create('Motors');

motorHatOne.init();
motorHatTwo.init();

const motors = {
  setup: function () {
    config.motor_hat_one.motor_config.forEach((item, i) => {
      motorHatOne.dcs[i].setSpeedSync(item.speed);
    });

    config.motor_hat_two.motor_config.forEach((item, i) => {
      motorHatTwo.dcs[i].setSpeedSync(item.speed);
    });

    logger.info('Motors Initialized.');
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

  purge: function () {
    logger.info('Purging all motors for 10 seconds.');
    motors.run_all();
    setInterval(motors.stop_all(), 10000);
  },
};

module.exports = motors;
