var should = require('should'),
	eventTrigger = require('../lib/eventTrigger');

var target, trigger;

describe('eventTrigger', function() {

	beforeEach(function() {
		target = {};
		trigger = eventTrigger.create(target);
	});

	it('adds an on() function', function() {
		var type = typeof target.on;
		type.should.equal('function');
	});

	it('returns a trigger function', function() {
		var type = typeof trigger;
		type.should.equal('function');
	});

	describe('#on', function() {
		it('should register single listener with no argument', function(done) {
			target.on('foo', function() {
				arguments.should.have.length(0);
				done();
			});
			trigger('foo');
		});

		it('should register multiple listeners with no argument', function(done) {
			var callbacks = 0;
			var createCallback = function(done) {
				
				return function() {
					arguments.should.have.length(0);
					callbacks++;
					if(callbacks == 3)
						done();
				};
			};

			target.on('foo', createCallback(done));
			target.on('foo', createCallback(done));
			target.on('foo', createCallback(done));

			trigger('foo');
		});

		it('should register single listener with arguments', function(done) {
			target.on('foo', function() {
				arguments.should.have.length(3);
				arguments[0].should.equal(1);
				arguments[1].should.equal('a');
				arguments[2].should.equal(true);
				done();
			});
			trigger('foo', 1, 'a', true);
		});

		it('should register multiple listeners with arguments', function(done) {
			var callbacks = 0;
			var createCallback = function(done) {
				
				return function() {
					arguments.should.have.length(2);
					arguments[0].should.equal('foo');
					arguments[1].should.equal('bar');
					callbacks++;
					if(callbacks == 3)
						done();
				};
			};

			target.on('foo', createCallback(done));
			target.on('foo', createCallback(done));
			target.on('foo', createCallback(done));

			trigger('foo', 'foo', 'bar');
		});
	});

});