const config = require('./server.config');
const leveldb = require('level')(config.leveldb_path);
const lem = require('lem');
const lemdb = lem(leveldb);

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'xadsl101',
    database: 'hydrobuddy',
  },
});

module.exports = {
  leveldb: leveldb,
  lemdb: lemdb,
  knex: knex,
};
