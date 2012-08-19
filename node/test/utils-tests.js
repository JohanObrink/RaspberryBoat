"use strict";
var expect = require('chai').expect,
	utils = require('../lib/utils');

describe('utils', function() {

	describe('#convertNmeaToDecimal', function() {

		it('should convert NMEA 0302.78469 to decimal', function() {

			expect(utils.convertNmeaToDecimal('0302.78469')).to.equal(3.0464115);

		});

		it('should convert NMEA 10141.82531 to decimal', function() {

			expect(utils.convertNmeaToDecimal('10141.82531')).to.equal(101.6970885);

		});

	});

});