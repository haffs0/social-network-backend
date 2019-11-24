const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRATION_DURATION } = require('./env-config');

exports.generateToken = async (data, options = { expiresIn: EXPIRATION_DURATION }) => {
  console.log(data, options)
  const token = await jwt.sign({ key: data }, SECRET_KEY, options);
  console.log(token)
  return token;
};

exports.verifyToken = (token) => jwt.verify(token, SECRET_KEY);

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
