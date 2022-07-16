const indexRouter = require('express').Router();

const usersRouter = require('./users');
const articlesRouter = require('./articles');

indexRouter.use("/users", usersRouter);
indexRouter.use("/articles", articlesRouter);

module.exports = indexRouter;
