const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./helpers/logger');
const userRoutes = require('./routes/user');
const stuffRoutes = require('./routes/stuff');
const cloud = require('./helpers/cloudinary-config');


const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use('*', cloud.cloudinaryConfig)
app.use(logger.requestLogger);

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/', stuffRoutes);
app.use(logger.unknownEndpoint);
app.use(logger.errorHandler);

module.exports = app;
