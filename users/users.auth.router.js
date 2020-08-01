const { Router } = require('express');

const {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
  getNewAvatar,
  logOut,
} = require('./users.controller');

const { validateAuthUser } = require('../helpers/validate');
const { authorization, uploadMulter } = require('./users.middleware');

const authRouter = Router();

authRouter.get('/', getUsers);
authRouter.post('/register', validateAuthUser, createUser);
authRouter.post('/login', validateAuthUser, loginUser);
authRouter.get('/users/current', authorization, getCurrentUser);
authRouter.patch(
  '/user/avatars',
  authorization,
  uploadMulter.single('ava'),
  getNewAvatar,
);
authRouter.post('/logout', logOut);

// app.post('/upload', upload.single('avatar'), (req, res, next) => {
//   // console.log(req.file);
//   // console.log(req.body);
//   res.status(200).send();
// }),
//

module.exports = authRouter;
