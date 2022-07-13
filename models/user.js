/* eslint-disable func-names */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../errors/errorHandler');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
    // validate: {
    //   validator: isEmail,
    // },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findByCredentails = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
      throw new UnauthorizedError();
      }
         return bcrypt.compare(password, user.password).then((matched) => {
           if (!matched) {
             throw new UnauthorizedError();
           }
           return user;
         });
    })
    .catch((err) => {
    throw new UnauthorizedError();
  });
};

module.exports = mongoose.model('user', userSchema);