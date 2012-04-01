(function() {
  var app, port;

  port = 8080;

  app = require('./express.js');

  app.listen(port);

  console.log('Listening on :' + port);

  require('./now.js').connect(app);

}).call(this);
