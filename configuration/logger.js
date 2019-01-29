const winston = require('winston');
const fs = require( 'fs' );
const path = require('path');
const { LOG_FILE_PATH } = require('./environment');

if ( !fs.existsSync( LOG_FILE_PATH ) ) {
    fs.mkdirSync( LOG_FILE_PATH );
}
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({format: winston.format.simple()}),
    new winston.transports.File(
      { 
        filename: path.join(LOG_FILE_PATH, '/all.log'),
        maxsize: 1000000,
        maxFiles: 5
      })
  ]
});

module.exports = logger;