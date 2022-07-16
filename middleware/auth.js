const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized');
  }

  const token = authorization.replace('Bearer ', '');
  console.log(token);
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    console.log(err);
    throw new UnauthorizedError('Unauthorized');
  }
  console.log(payload);
  req.user = payload;
  next();
};

module.exports = auth;
