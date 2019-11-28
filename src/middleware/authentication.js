const { respondWithWarning } = require('../helpers/responseHandler');
const { verifyToken, formatJWTErrorMessage } = require('../helpers/jwt');
const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessages');



module.exports = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) token = token.slice(6, token.length);
  if (!token) return respondWithWarning(res, statusCode.unauthorizedAccess, responseMessage.expiredSession);
  try {
    const { key } = await verifyToken(token);
    req.auth = key;
    return next()
  } catch (error) {
    return respondWithWarning(res, 401, formatJWTErrorMessage(error.message));
  }
};
