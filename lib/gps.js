var nmea = require('nmea'),
	serialport = require('serialport'),
	utils = require('./utils')

var Gps = function() {

}

Gps.prototype = {

};

exports.Gps = Gps;
exports.create = function() {
	return new Gps();
}