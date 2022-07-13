const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const centralErrorHandler = require('./errors/centralErrorHandler');
const { createUser, login } = require('./controllers/users');
require('dotenv').config();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/news-exp');
const app = express();
app.use(express.json());
app.use(helmet());

app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);

// app.post(
//   '/signup',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().min(2).max(30),
//       password: Joi.string().required().min(6),
//       name: Joi.string().min(2),
//     }),
//   }),
//   createUser
// );

// app.post(
//   '/signin',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().min(2).max(30),
//       password: Joi.string().required().min(6),
//     }),
//   }),
//   login
// );

app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});