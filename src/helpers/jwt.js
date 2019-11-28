const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRATION_DURATION } = require('./env-config');

exports.generateToken = async (data, options = { expiresIn: EXPIRATION_DURATION }) => {
  const token = await jwt.sign({ key: data }, SECRET_KEY, options);
  return token;
};

exports.verifyToken = async (token) => await jwt.verify(token, SECRET_KEY);

exports.formatJWTErrorMessage = (message) => {
  let formattedMessage;
  if (message.includes('invalid') || message.includes('malformed')) {
    formattedMessage = 'Session is invalid. Signin to continue';
  }
  if (message.includes('expired')) {
    formattedMessage = 'Session has expired. Singin to continue';
  }
  return formattedMessage;
};
