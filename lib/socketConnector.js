var _ = require('underscore');

var SocketConnector = exports.SocketConnector = function() {

};

SocketConnector.prototype = {

	connect: function(io) {
		io.sockets.on('connection', _.bind(this.registerListeners, this));
		this.io = io;
	},

	registerListeners: function(socket) {

	}

};

exports.create = function(io) {
	return new SocketConnector(io);
};