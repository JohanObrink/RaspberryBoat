var tracker = require('./gps/gpsTracker.js').createTracker('./files/test.log');
var fileName = dateStr(new Date()) + '.log';
var logger = require('./gps/gpsLogger.js').createLogger(tracker, './files/' + fileName);
tracker.connect('/dev/cu.usbserial', 4800, function(err) {
	if(err)
		console.log(err);
	else
		console.log('Connected');
});

function dateStr(date) {
	return (1900 + date.getYear()) + pad(date.getMonth() +1, 2) + pad(date.getDate(), 2) + '_' + pad(date.getHours(), 2) + pad(date.getMinutes());
}

function pad(num, chars) {
	var str = num.toString();
	while(str.length < chars)
		str = '0' + str;
	return str;
}