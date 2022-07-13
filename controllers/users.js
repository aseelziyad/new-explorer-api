const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const { UnauthorizedError, NotFoundError } = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;
dotenv.config();
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
        email,
        password: hash, // adding the hash to the database
        name,
      }))
    .then((user) => {
      res.send({
        _id: user._id,
      email: user.email });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // authentication successful! user is in the user variable
  User.findByCredentails(email, password)
    .then((user) => res.json({
        // creating the token
        token: jwt.sign(
          {
            _id: user._id,
          },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          }
        ),
      }))
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
  });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
