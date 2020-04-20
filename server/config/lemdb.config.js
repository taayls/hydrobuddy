const config = require('./config.server');
const leveldb = require('level')(config.leveldb_path);
const lem = require('lem');
const lemdb = lem(leveldb);

module.exports = {
  leveldb: leveldb,
  lemdb: lemdb,
};
