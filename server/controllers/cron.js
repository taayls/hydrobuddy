const CronJob = require('cron').CronJob;
const control = require('./controls');

const lights = new CronJob('30 * * * *', function () {
  control.light_schedule();
});

const nutrients = new CronJob('0 * * * *', function () {
  control.nutrient_schedule();
});

module.exports = {
  lights: lights,
  nutrients: nutrients,
};
