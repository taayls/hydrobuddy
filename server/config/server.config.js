const path = require('path');

module.exports = {
  port: 3000,
  ssl_enabled: false,
  ssl_port: 4000,
  ssl_key_path: path.resolve('~/hydrobuddy.local.key'),
  ssl_cert_path: path.resolve('~/hydrobuddy.local.crt'),
};
