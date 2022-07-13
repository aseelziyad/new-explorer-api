const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
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

app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);


app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});