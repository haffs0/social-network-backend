const bcrypt = require('bcrypt');
const pool = require('../models/connect');
const { respondWithSuccess, respondWithWarning } = require('../helpers/responseHandler');
const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessages');
const { generateToken } = require('../helpers/jwt');



exports.createUser = async (request, response) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address, phoneNumber, role, createUser, userAccess,
  } = request.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    const res = await pool.query('INSERT INTO public.user (first_name, last_name, email, password, gender, job_role, department, address, phone_number, role, create_user, user_access) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [firstName, lastName, email, hash, gender, jobRole, department, address, phoneNumber, role, createUser, userAccess]);

    const user = await pool.query('SELECT * FROM public.user WHERE email = $1', [email]);
   
    const data = user.rows[0];
    const payload = { userId: data.user_id, role: data.role };
    const token = await generateToken(payload);
    const values = {
      userId: data.user_id,
      token,
    };
    return respondWithSuccess(response, statusCode.created, responseMessage.userCreated, values);
  }
  catch (error) {
    console.log('bad', error)
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};
