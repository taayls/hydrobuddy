const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const jsonfile = require('jsonfile');
const Logger = require('logplease');
const logger = Logger.create('System', { color: Logger.Colors.Green });
const config = require('../config/server.config');

const system = {
  _data: {
    state: 'STOPPED',
    stage: 'SEEDLING',
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
  setState: function (value) {
    logger.debug(`Updating system state: ${value}`);
    this._data.state = value;
    this.save();
    this.events.emit('state', value);
  },
  setStage: function (value) {
    logger.debug(`Updating system stage: ${value}`);
    this._data.stage = value;
    this.save();
    this.events.emit('stage', value);
  },
  getData: function () {
    return this._data;
  },
  getState: function () {
    return this._data.state;
  },
  getStage: function () {
    return this._data.stage;
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
  setOverride: function () {
    this._data.override = true;
    this.events.emit('override', true);
    this.save();
  },
  cancelOverride: function () {
    this._data.override = false;
    this.events.emit('override', false);
    this.save();
  },
  isOverridden: function () {
    return this._data.override;
  },
};

module.exports = system;
