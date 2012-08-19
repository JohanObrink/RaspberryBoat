var expect = require('chai').expect;

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
			expect(device.connected).to.be.true;
		});

		it('should be reseted', function () {
			expect(device.values[0]).to.equal(1500);
			expect(device.values[2]).to.equal(0);
		});

		describe('#set', function() {
			it('should send correct value for throttle min', function() {
				rc.set(0, 0);
				expect(device.values[2]).to.equal(0);

				rc.set(0.1, 0);
				expect(device.values[2]).to.equal(1492);
			});
			it('should send correct value for throttle max', function() {
				rc.set(1, 0);
				expect(device.values[2]).to.equal(1420);
			});
			it('should send correct value for rudder min', function() {
				rc.set(0, -1);
				expect(device.values[0]).to.equal(1800);
			});
			it('should send correct value for rudder max', function() {
				rc.set(0, 1);
				expect(device.values[0]).to.equal(1200);
			});

			describe('dead mans grip', function() {
				it('should call reset after specified time', function(done) {
					rc.setDeadMansGripTimeout(100);
					rc.set(1,1);

					expect(device.values[2]).to.equal(1420);
					expect(device.values[0]).to.equal(1200);

					setTimeout(function() {
						expect(device.values[0]).to.equal(1500);
						expect(device.values[2]).to.equal(0);

						done();
					}, 150);
				})
			});
		});
	});

	describe('calling #set before #connect', function() {
		it('should throw an Error', function() {
			expect(function() { rc.set(1,2); }).to.throwError;
		});
	});
});