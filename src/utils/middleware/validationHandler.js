const boom = require('@hapi/boom');
const joi = require('joi');

const validateSchema = (data, schema) => {
  const joiSchema = joi.object(schema);
  const { error } = joiSchema.validate(data);
  return error;
};

const validationHandler = (schema, check = 'body') => {
  return function (req, res, next) {
    const error = validateSchema(req[check], schema);

    error ? next(boom.badRequest(error)) : next();
  };
};

module.exports = validationHandler;