var RcController = exports.RcController = function() {
	this.device = {}//require('../bin/usbmaestro');
};

RcController.prototype = {

	connected: false,

	connect: function() {
		this.device.connect();
		this.connected = true;
		this.reset();
	},

	reset: function() {
		this.set(0, 0);
	},

	set: function(throttle, rudder) {

		if(!this.connected)
			throw new Error('You must call connect before set');

		var r = 1500 - (300 * rudder);
		var t = (throttle == 0) ? 0 : 1500 - 80 * throttle;

		this.device.setTarget(0, r);
		this.device.setTarget(2, t);
	}
};

exports.create = function() {
	return new RcController();
}