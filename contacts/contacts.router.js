const { Router } = require('express');
const contactRouter = Router();
const {
  validateCreateContact,
  validateUpdateContact,
  validateObjectId,
} = require('../helpers/validate');
const {
  getContacts,
  getContact,
  createContact,
  removeContact,
  updateContact,
} = require('./contacts.controller');

// GET

contactRouter.get('/', getContacts);

//GET :id

contactRouter.get('/:contactId', validateObjectId, getContact);

// POST

contactRouter.post('/', validateCreateContact, createContact);

// Delete

contactRouter.delete('/:contactId', validateObjectId, removeContact);

// Patch

contactRouter.patch(
  '/:contactId',
  validateObjectId,
  validateUpdateContact,
  updateContact,
);

module.exports = contactRouter;
