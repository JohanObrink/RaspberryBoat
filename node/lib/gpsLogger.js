(function(exports) {

	var fs = require('fs');

	var start = function() {

		var _this = this;

		this.listener = function(data) {
			_this.stream.write(data + '\r');
		};

		this.gps.on('data', this.listener);
	
	};

	var stop = function() {

		if(this.listener)
			this.gps.removeListener('data', this.listener);

	};

	var attach = exports.attach = function(gps, fileOrStream, flags) {

		if(gps == null || 'function' !== typeof gps.on)
			throw new Error('first argument must be an EventEmitter (preferably a GPS');

		var stream;

		if('string' === typeof fileOrStream)
			stream = fs.open(fileOrStream, flags || 'w');
		else if(fileOrStream != null && 'function' === typeof fileOrStream.write)
			stream = fileOrStream;
		else
			throw new Error('second argument must be a file path or a writeable stream');

		return {
			gps: gps,
			stream: stream,
			start: start,
			stop: stop
		};
	};

})(module.exports);