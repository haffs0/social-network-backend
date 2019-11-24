const { respondWithWarning } = require('../helpers/responseHandler');
const pool = require('../models/connect');


exports.checkPermission = (permission) => async (req, res, next) => {
  const { userId, role } = req.auth;
  const result = await pool.query(`SELECT ${permission} FROM public.user WHERE user_id = $1 AND role = $2`, [userId, role]);
  const value = Object.entries(result.rows[0])
  if (!value[0][1]) return respondWithWarning(res, 403, 'Forbidden Action');
  console.log('here2')
  return next();

}
;