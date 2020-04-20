const config = require('../config/server.config');
const rpio = config.test ? null : require('rpio');
const lemdb = require('../config/lemdb.config').lemdb;

const EventEmitter = require('events').EventEmitter;
const events = new EventEmitter();

if (!config.test) rpio.init({ mapping: 'gpio' });

const save = function (key, status) {
  const value = status ? '1' : '0';
  lemdb.recorder(key)(value);
};

const relays = {
  events: events,
  setup: function () {
    if (config.test) return;

    this.ac.setup();
    this.lights.setup();
    this.exhaust_fan.setup();
    this.water_pumps.setup();
    this.fill_valve.setup();
    this.drain_valve.setup();
    this.drain_pump.setup();
  },
  off: function () {
    this.ac.off();
    this.lights.off();
    this.exhaust_fan.off();
    this.water_pumps.off();
    this.fill_valve.off();
    this.drain_valve.off();
    this.drain_pump.off();
  },
};

module.export = relays;
