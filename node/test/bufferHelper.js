(function() {

	exports.create = function() {
		var buffer = new Buffer(arguments.length*2);
		for(var i=0; i<arguments.length; i++) {
			buffer.writeUInt16BE(arguments[i], i*2);
		}
		return buffer;
	};

})();