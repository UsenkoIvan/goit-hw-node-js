const mongoose = require('mongoose');
const { string } = require('@hapi/joi');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    validate: value => value.includes('@'),
    unique: true,
    required: true,
    trim: true, // уберає пробели!!!
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },

  token: {
    type: String,
    trim: true,
  },
});

const userModel = mongoose.model('auth', userSchema);

module.exports = userModel;
