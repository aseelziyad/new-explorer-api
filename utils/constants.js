const { NODE_ENV, SERVER_ADDRESS } = process.env;
const rateLimit = require("express-rate-limit");

const DB_ADDRESS =
  NODE_ENV === 'production'
    ? SERVER_ADDRESS
    : 'mongodb://localhost:27017/news-exp';

module.exports = {
  DB_ADDRESS,
};

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
