const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  messageErr,
  ValidationError,
  CastError,
  messageErrDefault,
} = require('../constants/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageErr.notFound.user);
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === CastError) {
        next(new BadRequestError(messageErrDefault));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === ValidationError || err.name === CastError) {
        next(new BadRequestError(messageErr.badRequest.updateUserInfo));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'salt-salt-salt',
        { expiresIn: '1d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(messageErr.badRequest.unauthorized));
    });
};

// prettier-ignore
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.send({
      data: { name, email },
    }))
    .catch((err) => {
      if (err.name === ValidationError) {
        return next(new BadRequestError(messageErr.badRequest.createUser));
      }
      if (err.code === 11000) {
        return next(new ConflictError(messageErr.badRequest.conflictEmail));
      }
      return next(err);
    });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  loginUser,
  createUser,
};
