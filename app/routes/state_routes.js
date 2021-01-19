const { logger } = require('../../utils');

module.exports = function (app, db) {
  app.get('/state/:abb', (req, res, next) => {
    const result = db.findAll({where: {state_id: req.params.abb}});

    result.then(data => {
      try {
           if (data.length == 0) {
             res.status(404)
                .send({message: `no data found for state: ${req.params.abb}`});
           }
           else {
             output_list = [];
             data.forEach(function(item) {
               output_list.push(item.dataValues);
             });
             res.send({data: output_list,
                       source: process.env.ZIP_ATTRIBUTION_URL,
                       message: 'OK'});
             logger.info(`state: ${req.params.abb}, zipcodes: ${data.length}`);
           }
         }
      catch (err) {
        logger.debug(`State error, state: ${req.params.abb}, err: ${err}`);
        res.send(`an error occurred`);
      }
    });
  });
};
