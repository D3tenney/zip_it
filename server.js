require('dotenv').config();

// Logging
const { httpLogger } = require('./middleware');
const { logger } = require('./utils');

//app setup
const express = require('express');
const app = express();
app.use(httpLogger);
const port = process.env.PORT;

//DB setup in sequelize.js
const {Zipcode} = require('./sequelize');

//get app routes
require('./app/routes/')(app, Zipcode);


app.listen(port, () => {
  logger.info(`Running on port: ${port}`);
});
