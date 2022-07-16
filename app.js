const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi } = require("celebrate");
const { limiter } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middleware/logger');
const indexRouter = require("./routes/index");
const { DB_ADDRESS } = require("./utils/constants");
const { createUser, login } = require("./controllers/users");
const centralErrorHandler = require('./errors/centralErrorHandler');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect(DB_ADDRESS);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cors());
app.options("*", cors());
app.use(requestLogger);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login
);

app.use("/", indexRouter);

app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});