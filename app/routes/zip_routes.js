const { logger } = require('../../utils');

module.exports = function (app, db) {
  app.get('/zip/:code', (req, res) => {
    const result = db.findOne({where: {zip: req.params.code}});
    result.then(data => {
      // handle no results returned
      if (!data) {
        res.status(404)
           .send({message: `data not found for zipcode: ${req.params.code}`});
      }
      else {
        //Send results as JSON
        try {
          const output_data = data.dataValues;
          res.send({data: output_data,
                    source: process.env.ZIP_ATTRIBUTION_URL,
                    message: 'OK'});
        }
        //handle errors
        catch (err) {
          logger.debug(`Zip Error, zip: ${req.params.code}, err: ${err}`);
          res.status(500)
             .send({message: 'An error occurred.'})
        }
      }
    });
  });
};
