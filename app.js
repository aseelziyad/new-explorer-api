const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { limiter } = require('./middleware/limiter');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const centralErrorHandler = require('./errors/centralErrorHandler');
require('dotenv').config();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/news-exp');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
const corsOptions = {
  origin: true,
  credentials: true,
};
app.options('*', cors(corsOptions));

app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);

app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});