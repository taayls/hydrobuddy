const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const jsonfile = require('jsonfile');
const Logger = require('logplease');
const logger = Logger.create('System', { color: Logger.Colors.Green });
const moment = require('moment');

const config = require('../config/server.config');
const lemdb = require('../config/db.config').lemdb;

const system = {
  _data: {
    state: 'STOPPED',
    override: false,
    drain_cycle: 0,
  },
  events: new EventEmitter(),
  save: function () {
    logger.debug('Saving system state.');
    jsonfile.writeFileSync(config.state_path, this._data, { spaces: 2 });
  },
  load: function () {
    logger.debug('Loading system state.');
    if (!fs.existsSync(config.state_path)) return this.save();

    let data = jsonfile.readFileSync(config.state_path);
    Object.assign(this._data, data);

    logger.debug('Current State:', this._data);
  },
  record: function () {
    lemdb.recorder('system.state')(this._data.state);
  },
  setState: function (value) {
    logger.debug(`Updating system state: ${value}`);
    this._data.state = value;
    this.save();
    this.record();
    this.events.emit('state', value);
  },
  getState: function () {
    return this._data.state;
  },
  getDrainCycle: function () {
    return this._data.drain_cycle;
  },
  increaseDrainCycle: function () {
    logger.debug('Increasing drain cycle count.');
    this._data.drain_cycle++;
    this.save();
  },
  resetDrainCycle: function () {
    logger.debug('Resetting drain cycle count.');
    this._data.drain_cycle = 0;
    this.save();
  },
  setOverride: function (value) {
    this._data.override = value;
    this.events.emit('override', value);
    this.save();
  },
  isOverridden: function () {
    return this._data.override;
  },
};

module.exports = system;
