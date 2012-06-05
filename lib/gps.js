"use strict"
var nmea = require('nmea'),
	serialport = require('serialport'),
	SerialPort = serialport.SerialPort,
	utils = require('./utils'),
	_ = require('underscore');

var Gps = function() {

	// USB Port listener
	this.port = null;

	// Registered callbacks
	this.callbacks = {};
};

Gps.prototype = {

	// Connect to the GPS
	connect: function(path, baud, callback) {
		var params = {
			baudrate: baud,
			parser: serialport.parsers.readline('\r\n')
		};
		
		try {

			this.port = new SerialPort(path, params);
			callback(null);
			port.on('data', _.bind(this.ondata, this));

		} catch(err) {
			callback(err);
		}
		
	},

	// Disconnect from the GPS
	disconnect: function() {
		this.port = null;
	},

	// Called when data is read from the GPS
	ondata: function(line) {

		// Dispatch raw as data event
		this.dispatch('data', null, line);

		var obj = nmea.parse(line);
		if(!obj)
			return;

		// Dispatch parsed as nmea event
		this.dispatch('nmea', null, obj);

		switch(obj.type) {
			case 'nav-info':
			case 'fix':
				// Convert lat/lon to decimal format
				if(obj.lat && obj.lon) {
					obj.lat = utils.convertNmeaToDecimal(obj.lat);
					obj.lon = utils.convertNmeaToDecimal(obj.lon);
				}
				break;
			default:
				break;
		}

		// Dispatch the event
		this.dispatch(obj.type, null, obj);
	},

	// Call to register a listener
	on: function(type, callback) {
		if(!this.callbacks[type])
			this.callbacks[type] = [];
		this.callbacks[type].push(callback);
	},

	// Used to dispatch events to listeners
	dispatch: function(type, err, data) {
		if(this.callbacks[type]) {
			for(var i=0; i<this.callbacks[type].length; i++)
				this.callbacks[type][i](err, data);
		}
	},

	clearListeners: function(type) {
		if(!this.callbacks)
			return;

		if(type)
			this.callbacks[type] = null;
		else
			this.callbacks = {};
	}
};

exports.Gps = Gps;
exports.create = function() {
	return new Gps();
};
