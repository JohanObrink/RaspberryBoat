"use strict";
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

	this.connected = false;
};

Gps.prototype = {

	// Connect to the GPS
	connect: function(path, baud, callback) {
		
		if(this.connected) {
			console.log('Allready connected');
			callback('Allready connected');
			return;
		}

		try {
			this.port = new SerialPort(path, { baudrate: baud, parser: serialport.parsers.readline('\r\n') });
			this.connected = true;

			callback();
			this.port.on('data', _.bind(this._ondata, this));
			this.port.on('error', function(err) {
				console.log('GPS Error: ' + err);
			});

		} catch(err) {
			callback(err);
		}
		
	},

	// Disconnect from the GPS
	disconnect: function() {
		this.port = null;

		return this;
	},

	// Called when data is read from the GPS
	_ondata: function(line) {
		// Dispatch raw as data event
		this.dispatch('data', line);

		var obj = nmea.parse(line);

		if(!obj)
			return;

		// Dispatch parsed as nmea event
		this.dispatch('nmea', obj);

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
		this.dispatch(obj.type, obj);
	},

	// Call to register a listener
	on: function(type, callback) {
		if(!this.callbacks[type])
			this.callbacks[type] = [];
		this.callbacks[type].push(callback);

		return this;
	},

	// Used to dispatch events to listeners
	dispatch: function(type, data) {
		if(this.callbacks[type]) {
			for(var i=0; i<this.callbacks[type].length; i++)
				this.callbacks[type][i](data);
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
