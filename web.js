
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	port = 8080;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')(
    {
      src: __dirname + '/public',
      compress: false,
      debug: true,
      force: true
    }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(port, function(){

  // Hook up everything
  require('./lib/connectNow').connect(
    require('socket.io').listen(app),
    require('./lib/gps').create(),
    require('./lib/rcController').create());
  
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});