const Joi = require('@hapi/joi');

function validateCreateContact(req, res, next) {
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

function validateObjectId(req, res, next) {
  const objectIdSchema = Joi.object({
    id: Joi.objectId(),
  });
  const result = objectIdSchema.validate(req.params);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
}

module.exports = {
  validateCreateContact,
  validateUpdateContact,
  validateObjectId,
};
