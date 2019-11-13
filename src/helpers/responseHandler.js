const respondWithSuccess = (res, statusCode = 200, message, additionalFields = {}) => {
  const payload = Array.isArray(additionalFields) ? [...additionalFields] : { ...additionalFields };
  return res.status(statusCode).send({ success: true, message, payload });
};

const respondWithWarning = (res, statusCode = 500, message, additionalFields = {}) => res.status(statusCode).send({ success: false, message, payload: { ...additionalFields } });

module.exports = {
  respondWithSuccess,
  respondWithWarning,
};
