(function() {
  var app;

  app = require('./express.js');

  app.listen(8080);

  require('./now.js').connect(app);

}).call(this);
