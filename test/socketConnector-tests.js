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

	//describe('#registerListeners')

});