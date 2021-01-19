const { logger } = require('./utils');

const Sequelize = require('sequelize');
const ZipcodeModel = require('./models/zipcode');

const uri = 'sqlite:' + process.env.DB_LOCATION;
const sequelize = new Sequelize(uri, {logging: false});

const Zipcode = ZipcodeModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    logger.info(`Database & tables synced`);
  });

module.exports = {
  Zipcode
};
