var should = require('should');
var TurnTaker = require('../lib/turnTaker');

describe('TurnTaker', function() {

	var tt = new TurnTaker();

	var call1 = function(err, data, callback) {
		callback(null, 'foo');
	};
	var call2 = function(err, data, callback) {
		callback(null, 'bar');
	};

	describe('#addCall', function() {
		it('should save functions in the calls list', function() {
			tt.addCall(call1);
			tt.addCall(call2);

			tt.calls.length.should.equal(2);
			tt.calls[0].should.equal(call1);
			tt.calls[1].should.equal(call2);
		});
	});
});