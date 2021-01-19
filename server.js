require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');


// Logging
const { httpLogger } = require('./middleware');
const { logger } = require('./utils');

//app setup
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(httpLogger);
const port = process.env.PORT;

//DB setup in sequelize.js
const {Zipcode} = require('./sequelize');

//get app routes
require('./app/routes/')(app, Zipcode);


app.listen(port, () => {
  logger.info(`Running on port: ${port}`);
});
