/* eslint-disable func-names */
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../errors/errorHandler');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: isEmail,
    },
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
  saved: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "article",
      },
    ],
    default: [],
  },
});

userSchema.statics.findByCredentails = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
      throw new UnauthorizedError('Unauthorized');
      }
         return bcrypt.compare(password, user.password).then((matched) => {
           if (!matched) {
             throw new UnauthorizedError('Unauthorized');
           }
           return user;
         });
    })
    .catch((err) => {
       console.log(err);
    throw new UnauthorizedError('Unauthorized');
  });
};

module.exports = mongoose.model('user', userSchema);