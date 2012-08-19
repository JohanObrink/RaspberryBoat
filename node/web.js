
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
app.get('/video/front', routes.video.front);

app.listen(port, function(){

  // Hook up everything
  var io = require('socket.io').listen(app);
  io.set('log level', 1);
  
  var gps = require('./lib/gps').create();
  var controller = require('./lib/rcController').create();

//  var faker = require('./lib/gpsFaker').create().attach(gps).open('./files/gps-test.log').start();

  require('./lib/connectNow').connect(
    io,
    gps,
    controller);
  
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
