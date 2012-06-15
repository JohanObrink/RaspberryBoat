var should = require('should'),
	eventTrigger = require('../lib/eventTrigger');

var connector, io, trigger;

describe('SocketConnector', function() {

	beforeEach(function() {
		io = {
			sockets: {}
		};

		trigger = eventTrigger.create(io.sockets);
		connector = require('../lib/socketConnector').create();

	});

	it('calls registerListeners after "connection" event', function(done) {

		var s = {};

		connector.registerListeners = function(socket) {
			socket.should.equal(s);
			done();
		}

		connector.connect(io);
		trigger('connection', s);

	});

	describe('#registerListeners', function() {

		var controller, gps;

		it('should hook up controller', function(done) {

			var data = {
				throttle: 0.5,
				rudder: -0.8
			};

			controller = {
				set: function(throttle, rudder) {
					throttle.should.equal(data.throttle);
					rudder.should.equal(data.rudder);
					done();
				}
			};
			var s = {};
			var sTrigger = eventTrigger.create(s);

			connector.connect(io, controller);

			trigger('connection', s);
			sTrigger('controller.set', data);

		});

		/*it('should hook up gps', function(done) {

			var data = {};

			gps = {
				connect: function(path, baud, callback) {
					baud.should.equal(4800);
					done();
				}
			};
			var s = {};
			var sTrigger = eventTrigger.create(s);

			connector.connect(io, controller);

			trigger('connection', s);
			sTrigger('controller.set', data);

		});*/

	});

});