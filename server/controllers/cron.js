const CronJob = require('cron').CronJob;
const control = require('./controls');

const lights = new CronJob('*/15 */1 * * *', function () {
  control.light_schedule();
});

const nutrients = new CronJob('* * * * *', function () {
  control.nutrient_schedule();
});

module.exports = {
  lights: lights,
  nutrients: nutrients,
};
