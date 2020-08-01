const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

function validateAuthUser(req, res, next) {
  const authUserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.object({
      type: Joi.string(),
      enum: [Joi.string()],
      default: Joi.string(),
    }),
    token: Joi.string(),
  });

  const result = authUserSchema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.message);
  }
  next();
}

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
    _id: Joi.objectId(),
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
  validateAuthUser,
};
