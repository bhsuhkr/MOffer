const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'prod',
  database: process.env.DB_NAME || 'moffer',
  connectionString : process.env.DB_CONN_STRING || '',
  debug: true,
  parseJSON: true
}