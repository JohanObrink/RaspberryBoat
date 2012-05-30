var should = require('should'),
	utils = require('../lib/utils');

describe('utils', function() {

	describe('#convertNmeaToDecimal', function() {

		it('should convert NMEA 0302.78469 to decimal', function() {

			utils.convertNmeaToDecimal('0302.78469').should.equal(3.0464115);

		});

		it('should convert NMEA 10141.82531 to decimal', function() {

			utils.convertNmeaToDecimal('10141.82531').should.equal(101.6970885);

		});

	});

});