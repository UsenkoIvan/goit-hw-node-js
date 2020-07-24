const { Router } = require('express');
const {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
  logOut,
} = require('./users.controller');

const { validateAuthUser } = require('../helpers/validate');
const { authorization } = require('./users.middleware');

const authRouter = Router();

authRouter.get('/', getUsers);
authRouter.post('/register', validateAuthUser, createUser);
authRouter.post('/login', validateAuthUser, loginUser);
authRouter.get('/users/current', authorization, getCurrentUser);
authRouter.post('/logout', logOut);

module.exports = authRouter;
