const path = require('path');

module.exports = {
  host: 'http://hydrobuddy.local:3000',
  test: true,
  automate: true,
  port: 3000,
  leveldb_path: './temp/leveldb_data',
  state_path: './state.json',
};
