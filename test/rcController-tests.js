var should = require('should');

var rc, device;

describe('RcController', function() {
	beforeEach(function() {
		rc = require('../lib/rcController').create();
		
		device = {
			connected: false,
			values: {},
			connect: function() {
				this.connected = true;
			},
			reset: function() {
				this.reseted = true;
			},
			setTarget: function(channel, value) {
				this.values[channel] = value;
			}
		};

		rc.device = device;
	});

	describe('#connect', function() {

		beforeEach(function() {
			rc.connect();
		});

		it('should call connect on the device', function() {
			device.connected.should.equal(true);
		});

		it('should be reseted', function () {
			device.values[0].should.equal(1500);
			device.values[2].should.equal(0);
		});

		describe('#set', function() {
			it('should send correct value for throttle min', function() {
				rc.set(0, 0);
				device.values[2].should.equal(0);

				rc.set(0.1, 0);
				device.values[2].should.equal(1492);
			});
			it('should send correct value for throttle max', function() {
				rc.set(1, 0);
				device.values[2].should.equal(1420);
			});
			it('should send correct value for rudder min', function() {
				rc.set(0, -1);
				device.values[0].should.equal(1800);
			});
			it('should send correct value for rudder max', function() {
				rc.set(0, 1);
				device.values[0].should.equal(1200);
			});
		});
	});

	describe('calling #set before #connect', function() {
		it('should throw an Error', function() {
			(function() { rc.set(1,2); }).should["throw"]();
		});
	});
});