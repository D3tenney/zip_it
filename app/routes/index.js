const zipRoutes = require('./zip_routes');
const stateRoutes = require('./state_routes');

module.exports = function(app, db) {zipRoutes(app, db);
                                    stateRoutes(app, db);
                                  };
