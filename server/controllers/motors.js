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
};

module.exports = motors;
