var RcController = exports.RcController = function() {
	this.device = {
		connect: function() {
			console.log('servo connected');
		},
		setTarget: function(num, val) {
			console.log('setting ' + num + ' to ' + val);
		}
	}//require('../bin/usbmaestro');
};

RcController.prototype = {

	connected: false,
	deadMansGripTimeout: 2000,
	_timeout: 0,

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

		clearTimeout(this._timeout);
		this._timeout = setTimeout(function(obj) {
			obj.reset();
		}, this.deadMansGripTimeout, this);
	},

	setDeadMansGripTimeout: function(value) {
		this.deadMansGripTimeout = value;
	}
};

exports.create = function() {
	return new RcController();
}