const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Avatar = require('avatar-builder');
const userModel = require('./users.model');
const { set } = require('mongoose');

const getUsers = async (req, res) => {
  const userList = await userModel.find();
  res.send(userList);
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await userModel.findOne({ email });

    if (candidate) {
      res.status(409).send(`Email ${email} in use`);
    }

    const hashPass = await bcryptjs.hash(password, 10);

    const catAvatar = Avatar.catBuilder(256);

    catAvatar
      .create('sample2-1')
      .then(buffer =>
        fs.writeFileSync('./public/images/defaultAva.png', buffer),
      );

    const newUser = new userModel({
      email,
      password: hashPass,
      avatarURL: '../images/defaultAva.png',
    });
    // console.log(newUser);

    const userInDb = await newUser.save();

    res.status(201).send(userInDb);
  } catch (err) {
    res.status(500).send('Something wrong in DB' + err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).send(`User with email ${email} not found`);
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.status(401).send('Email or password is wrong');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const updateUser = await userModel.findOneAndUpdate(
      { email },
      { $set: { token } },
      { new: true },
    );

    // "Bearer" AUTORIZATION
    // res.json({ token });

    //cookie

    res.cookie('token', token, { httpOnly: true });
    res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).send('Something wrong in DB ' + err);
  }
};

const getCurrentUser = (req, res) => {
  res.status(200).send(req.user);
};

const logOut = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOneAndUpdate(
    { email },
    { $set: { token: null } },
    { new: true },
  );
  if (!user) {
    res.status(401).send({
      message: 'Not authorized',
    });
  }

  res.status(204).send('No Content');
};

const getNewAvatar = async (req, res) => {
  // console.log('req.user', req.user);
  // console.log('req.file', req.file);

  const { email } = req.user;
  const userAvatarUpdate = await userModel.findOneAndUpdate(
    { email },
    { $set: { avatarURL: `./images/${req.file.filename}` } },
    { new: true },
  );

  res.send(userAvatarUpdate);
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  getNewAvatar,
  logOut,
};
