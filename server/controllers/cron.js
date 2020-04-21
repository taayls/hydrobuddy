const CronJob = require('cron').CronJob;
const control = require('./controls');

const lights = new CronJob('*/15 */1 * * *', function () {
  control.light_schedule();
});

module.exports = {
  lights: lights,
};
