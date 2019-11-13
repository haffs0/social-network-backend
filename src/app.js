const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./helpers/logger');
const cloud = require('./helpers/cloudinary-config')


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('*', cloud.cloudinaryConfig)
app.use(logger.requestLogger);


app.use(logger.unknownEndpoint);
app.use(logger.errorHandler);

module.exports = app;
