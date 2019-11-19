/* eslint-disable no-console */
require('dotenv').config();

const pool = require('./connect');

/*
  Init Data
*/
const insertInitData = () => {
    const queryText = `INSERT INTO user (first_name, last_name, email, password, gender, job_role, department,address, phone_number, role, create_user, user_access) VALUES  ('Rowling', 'Potter', 'john@teamwork.com', '123456', 'male', 'developer', 'IT', 'ipaja', '090873654375', 'User', null, 'Yes');`
  
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create All Tables
 */
const insertAllData = () => {
  insertInitData();
};

module.exports = {
  insertAllData,
  insertInitData,
};

require('make-runnable');
