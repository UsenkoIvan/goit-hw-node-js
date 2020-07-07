const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const shotrid = require('shortid');
const Joi = require('@hapi/joi');
const contactsDB = require('../db/contacts.json');

const app = express();

const PORT = 3010;

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

// Read GET
app.get('/api/contacts', listContacts);

function listContacts(req, res) {
  res.send(contactsDB);
}

app.get('/api/contacts/:contactId', getById);

function getById(req, res) {
  const { contactId } = req.params;

  const reqContactWithId = contactsDB.find(({ id }) => id === contactId);
  if (!reqContactWithId) {
    res.status(404).send({ messeage: 'Not Found' });
  }

  res.send(reqContactWithId);
}

// Write POST
app.post('/api/contacts', validateCreateContats, createContact);

function validateCreateContats(req, res, next) {
  const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const result = contactSchema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.message);
  }
  next();
}

function createContact(req, res) {
  const id = shotrid();
  const { name, email, phone } = req.body;

  const NewContact = {
    name,
    email,
    phone,
    id,
  };

  contactsDB.push(NewContact);

  res.status(201).send(NewContact);
}

// Delete
app.delete('/api/contacts/:contactId', removeContact);

function removeContact(req, res) {
  const { contactId } = req.params;

  const findId = contactsDB.find(({ id }) => id === contactId);

  if (findId) {
    const deletedContactsWithId = contactsDB.filter(
      ({ id }) => id !== contactId,
    );
    res.send({ message: 'contact deleted' });
  } else {
    res.status(404).send({ message: 'Not found' }); // щось пішло не так))), не можу сообразить, що роблю не правильно
  }
}

app.patch('/api/contacts/:contactId', validateUpdateContact, updateContact);

function validateUpdateContact(req, res, next) {
  const contactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const result = contactSchema.validate(req.body);
  if (result.error) {
    res.status(400).send({ message: 'missing fields' });
  }
  next();
}

function updateContact(req, res) {
  const { contactId } = req.params;

  const contactIndex = contactsDB.findIndex(({ id }) => id === contactId);

  if (contactIndex) {
    contactsDB[contactIndex] = {
      ...contactsDB[contactIndex],
      ...req.body,
    };

    res.send(contactsDB[contactIndex]);
  } else {
    res.status(400).send({ message: 'missing fields' }); // тут тоже щось йде не так, не можу понять "шо не так"
  }
}

app.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
