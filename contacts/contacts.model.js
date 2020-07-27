const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: value => value.includes('@'),
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const contactModel = mongoose.model('contact', contactSchema);

module.exports = contactModel;
