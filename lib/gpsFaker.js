(function() {

	var flr = require('./fileLineReader'),
		_ = require('underscore');

	function open(path, encoding) {
		this.reader = flr.create(path, encoding);

		this.close = function() {
			this.reader = null;
		}
	}

	function attach(gps) {
		if(this.gps)
			this.detach();

		this.gps = gps;

		var _connect = this.gps.connect;
		this.detach = function() {
			this.gps.connect = _connect;
			this.gps = null;
		};

		this.gps.connect = _.bind(this.start, this);
	}

	function start() {
		if(!this.gps)
			throw new Error('GPS must be attached');

		if(!this.reader)
			throw new Error('A file has to be opened');
	}

	function stop() {

	}

	function create() {

		return {
			reader: null,
			gps: null,
			open: open,
			attach: attach,
			start: start,
			stop: stop
		};

	};

	this.create = create;

}).call(module.exports);