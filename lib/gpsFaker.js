"use strict";
(function() {

	var flr = require('./fileLineReader'),
		_ = require('underscore'),
		nmea = require('nmea');

	function open(path, encoding) {

		//attach a reader to the file
		this.reader = flr.create(path, encoding);

		//create a close function
		this.close = function() {
			this.reader = null;
		};
	}

	function attach(gps) {
		//detach old gps first
		if(this.gps)
			this.detach();

		this.gps = gps;

		//save the gps' connect function and reset it on detach
		var _connect = this.gps.connect;
		this.detach = function() {
			this.gps.connect = _connect;
			this.gps = null;
		};

		//replace the gps' connect function
		this.gps.connect = _.bind(this.start, this);
	}

	function start() {
		if(!this.gps)
			throw new Error('GPS must be attached');

		if(!this.reader)
			throw new Error('A file has to be opened');

		this._stopped = false;
		readNext.call(this);
	}

	function stop() {
		this._stopped = true;
		clearTimeout(this._timeout);
	}

	function readNext() {
		if(this._stopped) {
			return;
		}

		if(this.reader.eof()) {
			this.stop();
			return;
		}

		//read a line from the file
		var line = this.reader.readLine();

		//parse it to an object
		var data = nmea.parse(line);

		//set timestamp to parsed value, old timestamp value or 0
		var ts = parseFloat(data.timestamp) || this._timestamp || 0;
		var wait = 0;

		//set wait to new - old timestamp but no more than 1 second
		if(this._timestamp && this._timestamp > 0)
			wait = Math.min(ts - this._timestamp, 1);

		//store timestamp
		this._timestamp = ts;

		//set timeout to wait * length of second
		this._timeout = setTimeout(function(obj) {
			
			if(!obj.gps) {
				throw new Error('GPS must be attached');
			}
			else {
				//send data to the gps
				obj.gps._ondata(line);
			}

			// read next line
			readNext.call(obj);

		}, this._secondLength * wait, this);
	}

	function create(secondLength) {

		return {
			_secondLength: secondLength || 1000,
			reader: null,
			gps: null,
			open: open,
			attach: attach,
			start: start,
			stop: stop
		};

	}

	this.create = create;

}).call(module.exports);