(function() {

	var flr = require('./fileLineReader'),
		_ = require('underscore');

	function open(path, encoding) {
		this.reader = flr.create(path, encoding);
	}

	function attach(gps) {

		gps.connect = _.bind(this.start, this);

		this.gps = gps;
	}

	function start() {

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