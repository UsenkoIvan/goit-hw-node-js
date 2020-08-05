const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Avatar = require('avatar-builder');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const userModel = require('./users.model');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: `${email}`,
//   from: 'ivanja1994@gmail.com',
//   subject: 'Please verify your email',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// sgMail.send(msg);

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
      verificationToken: uuid.v4(),
    });
    // console.log(newUser);

    const userInDb = await newUser.save();

    // Sendgrid email verification
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${userInDb.verificationToken}`;

    const msg = {
      to: `${email}`,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<a href="${verificationLink}">Verification link</a>`,
    };

    await sgMail.send(msg);
    //

    res.status(201).send(userInDb);
  } catch (err) {
    res.status(500).send('Something wrong in DB' + err);
  }
};

const verificationEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const userWithVerificationToken = await userModel.findOneAndUpdate(
      {
        verificationToken,
      },
      { verificationToken: null },
    );
    if (!userWithVerificationToken) {
      res.status(404).send({ messeage: 'User not found' });
    }

    res.send('OK');
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

// async function sendVerificationEmail(user) {
//   const { email, verificationToken } = user;

//   const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;
//   await emailingClient.sendVerificationEmail(email, verificationLink);
// }
module.exports = {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  getNewAvatar,
  logOut,
  verificationEmail,
};
