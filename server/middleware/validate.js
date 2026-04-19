const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required()
      .messages({ 'string.min': 'Name must be at least 2 characters' }),
    email: Joi.string().email().required()
      .messages({ 'string.email': 'Please provide a valid email' }),
    password: Joi.string().min(6).max(128).required()
      .messages({ 'string.min': 'Password must be at least 6 characters' })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  scanUrl: Joi.object({
    url: Joi.string().uri({ allowRelative: false }).required()
      .messages({ 'string.uri': 'Please provide a valid URL' })
      .allow(Joi.string().pattern(/^[a-zA-Z0-9]/).required())
  })
};

/**
 * Validation middleware factory
 * @param {string} schemaName - Name of the schema to use
 */
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = validate;
