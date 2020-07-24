const jwt = require('jsonwebtoken');
const userModel = require('./users.model');

const authorization = async function (req, res, next) {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET); //{ id: user._id }
  } catch (err) {
    return res.status(401).send({
      message: 'Not authorized',
    });
  }

  const user = await userModel.findById(payload.id);

  req.user = user;

  next();
};

const authWithCookies = async function (req, res, next) {
  // 1. get jwt-token from client request +
  // 2. verify jwt token +
  // 3. fetch corresponding user from DB +
  // 4. pass user object to req. +
  // 5. pass control to next middleware +

  const token = req.cookies.token;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
  } catch (err) {
    return res.status(401).send({
      message: 'Not authorized',
    });
  }

  const user = await userModel.findById(payload.id);

  req.user = user;

  next();
};

module.exports = {
  authorization,
  authWithCookies,
};
