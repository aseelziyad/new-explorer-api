const winston = require('winston');
const expressWinston = require('express-winston');

// create request logger
//!  will log two types of information — requests to the server and errors that occur on it
const requestLogger = expressWinston.logger({
  // ! trasports responsible for where the log should be written. = req log
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
