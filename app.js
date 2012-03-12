
var tracker = require('./gpsTracker.js').createTracker();

tracker.connect('/dev/cu.usbserial', 4800, function(err){
	if(err)
		console.log(err);
	else
		console.log('Connected');
});


var express = require('express');

var app = module.exports = express.createServer();

// Configuration
var bootstrap = require('bootstrap-stylus'),
	stylus = require('stylus');

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(bootstrap());
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
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

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(8088);

var nowjs = require("now");
var everyone = nowjs.initialize(app);


everyone.now.runTest = function() {
	tracker.runTest();
}


tracker.onSatelliteList(function(err, data) {
	//console.log(data);
});

tracker.onFix(function(err, data) {
	console.log(data.lat + ', ' + data.lon);
	if(everyone.now.fix)
		everyone.now.fix(data);
});