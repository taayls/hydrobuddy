const config = require('../config/server.config');
const EventEmitter = require('events').EventEmitter;
const rpio = require('rpio');
const lemdb = require('../config/db.config').lemdb;
const events = new EventEmitter();

rpio.init({ mapping: 'gpio' });

const save = function (key, status) {
  const value = status ? '1' : '0';
  lemdb.recorder(key)(value);
};

const relays = {
  events: events,
  setup: function () {
    //if (config.test) return;
    this.ac.setup();
    this.lights.setup();
    this.exhaust_fan.setup();
    this.system_pumps.setup();
    this.fill_valve.setup();
    this.drain_valve.setup();
    this.drain_pump.setup();
  },
  off: function () {
    this.ac.off();
    this.lights.off();
    this.exhaust_fan.off();
    this.system_pumps.off();
    this.fill_valve.off();
    this.drain_valve.off();
    this.drain_pump.off();
  },
  ac: {
    pin: 27,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.LOW);
      save('ac.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.LOW);
    },
    status: function () {
      return !!rpio.read(this.pin);
    },
    onChange: function () {
      save('ac.status', this.status());
      events.emit('change', 'ac.status', this.status());
    },
  },
  lights: {
    pin: 13,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('lights.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('lights.status', this.status());
      events.emit('change', 'lights.status', this.status());
    },
  },
  exhaust_fan: {
    pin: 6,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('exhaust_fan.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('exhaust_fan.status', this.status());
      events.emit('change', 'exhaust_fan.status', this.status());
    },
  },
  system_pumps: {
    pin: 5,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('system_pumps.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('system_pumps.status', this.status());
      events.emit('change', 'system_pumps.status', this.status());
    },
  },
  fill_valve: {
    pin: 16,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('fill_valve.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('fill_valve.status', this.status());
      events.emit('change', 'fill_valve.status', this.status());
    },
  },
  drain_valve: {
    pin: 17,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('drain_valve.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('drain_valve.status', this.status());
      events.emit('change', 'drain_valve.status', this.status());
    },
  },
  drain_pump: {
    pin: 12,
    setup: function () {
      rpio.open(this.pin, rpio.OUTPUT);
      rpio.poll(this.pin, this.onChange.bind(this));
      rpio.write(this.pin, rpio.HIGH);
      save('drain_pump.status', this.status());
    },
    on: function () {
      !this.status() && rpio.write(this.pin, rpio.LOW);
    },
    off: function () {
      this.status() && rpio.write(this.pin, rpio.HIGH);
    },
    status: function () {
      return !rpio.read(this.pin);
    },
    onChange: function () {
      save('drain_pump.status', this.status());
      events.emit('change', 'drain_pump.status', this.status());
    },
  },
};

module.exports = relays;
