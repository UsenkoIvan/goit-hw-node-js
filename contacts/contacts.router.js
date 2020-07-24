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

const { authorization, authWithCookies } = require('../users/users.middleware');

// GET

contactRouter.get('/', authorization, getContacts);

//GET :id

contactRouter.get('/:contactId', authorization, validateObjectId, getContact);

// POST

contactRouter.post('/', authorization, validateCreateContact, createContact);

// Delete

contactRouter.delete(
  '/:contactId',
  authorization,
  validateObjectId,
  removeContact,
);

// Patch

contactRouter.patch(
  '/:contactId',
  validateObjectId,
  validateUpdateContact,
  updateContact,
);

module.exports = contactRouter;
