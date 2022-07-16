const { NODE_ENV, SERVER_ADDRESS } = process.env;

const DB_ADDRESS =
  NODE_ENV === 'production'
    ? SERVER_ADDRESS
    : 'mongodb://localhost:27017/news-exp';

module.exports = {
  DB_ADDRESS,
};
