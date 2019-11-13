const Joi = require('@hapi/joi');

module.exports = {
  name: Joi.string().required().trim(),
  password: Joi.string().required(),
  email: Joi.string().email().required().trim(),
  gender: Joi.string().valid('male', 'Male', 'female', 'Female').required(),
  dateCreate: Joi.date(),
  userRole: Joi.string().required(),
  job: Joi.string().required(),
  department: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  jobRole: Joi.string().required(),
  address: Joi.string().required(),
  id: Joi.number().integer().required(),
  createUser: Joi.string(),
  userAccess: Joi.string(),
};
