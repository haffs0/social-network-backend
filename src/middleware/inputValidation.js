const Joi = require('@hapi/joi');
const { respondWithWarning } = require('../helpers/responseHandler');
const validator = require('../helpers/validators');
const statuscode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessages');


const validateSigninFormData = (req, res, next) => {

  const createSignInSchema = Joi.object().keys({
    email: validator.email,
    password: validator.password,
  });
  const { error } = createSignInSchema.validate(req.body);
  if (!error) {
    return next();
  }
  return respondWithWarning(res, statuscode.badRequest, 'Incorrect email or password', error);
};

const validateCreateUserFormData = (req, res, next) => {
  const data = req.body;
  const createUserSchema = Joi.object().keys({
    firstName: validator.name,
    lastName: validator.name,
    email: validator.email,
    password: validator.password,
    gender: validator.gender,
    role: validator.userRole,
    department: validator.department,
    jobRole: validator.jobRole,
    phoneNumber: validator.phoneNumber,
    address: validator.address,
    createser: validator.createUser,
    userAccess: validator.userAccess,
  });
  const schema = data.constructor === Array ? Joi.array().items(createUserSchema) : createUserSchema;
  const { error } = schema.validate(data, {abortEarly: false });
  if (!error) {
    return next();
  }
  return respondWithWarning(res, statuscode.badRequest, responseMessage.badInputRequest, error);
};

module.exports = {
  validateCreateUserFormData,
  validateSigninFormData,
};
