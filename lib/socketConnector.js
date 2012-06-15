var _ = require('underscore');

var SocketConnector = exports.SocketConnector = function() {

};

SocketConnector.prototype = {

	connect: function(io, controller, gps) {
		this.io = io;

		var self = this;

		io.sockets.on('connection', function(socket) {
			self.registerListeners(socket, controller, gps);
		});
	},

	registerListeners: function(socket, controller, gps) {

		// hook up controller
		socket.on('controller.set', function(data) {
			controller.set(data.throttle, data.rudder);
		});

		// hook up gps
	}

};

exports.create = function(io) {
	return new SocketConnector(io);
};