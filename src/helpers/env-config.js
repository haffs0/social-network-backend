require('dotenv').config();

const { PORT } = process.env;

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
const { USER, HOST, DATABASE, PASSWORD, POSTGRESPORT, DATABASE_URL } = process.env;
const { SECRET_KEY, EXPIRATION_DURATION } = process.env;
const { ROLE } = process.env;

const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  USER,
  HOST,
  DATABASE,
  PASSWORD,
  POSTGRESPORT,
  PORT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  SECRET_KEY,
  EXPIRATION_DURATION,
  ROLE,
  DATABASE_URL,
  isTest,
};
