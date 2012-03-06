var Tracker = new require('./gpsTracker.js');
var tracker = new Tracker();

tracker.connect('/dev/cu.usbserial', 4800, function(err){
	if(err)
		console.log(err);
	else
		console.log('Connected');
});

tracker.onSatelliteList(function(err, data) {
	//console.log(data);
});

tracker.onFix(function(err, data) {
	console.log(data);
});