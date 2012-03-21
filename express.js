(function() {
  var app, bootstrap, compile, express, stylus;

  express = require('express');

  app = express.createServer();

  module.exports = app;

  bootstrap = require('bootstrap-stylus');

  stylus = require('stylus');

  compile = function(str, path) {
    return stylus(str).set('filename', path).use(bootstrap());
  };

  app.configure = function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({
      src: __dirname + '/public',
      compile: compile
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  };

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', function(req, res) {
    return res.render('index');
  });

}).call(this);
