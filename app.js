var tracker = require('./gpsTracker.js').createTracker();

tracker.connect('/dev/cu.usbserial', 4800, function(err){
	if(err)
		console.log(err);
	else
		console.log('Connected');
});

var app = require('express').createServer();
app.register('.html', require('jade'));
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/views/index.html');
});

app.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(app);




tracker.onSatelliteList(function(err, data) {
	//console.log(data);
});

tracker.onFix(function(err, data) {
	console.log(data.lat + ', ' + data.lon);
	if(everyone.now.fix)
		everyone.now.fix(data);
});