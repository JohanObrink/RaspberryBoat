"use strict";
var expect = require('chai').expect,
	nmea = require('nmea'),
	utils = require('../lib/utils');

describe('Gps', function() {

	var fix = '$GPGGA,212349.903,5920.4333,N,01800.5195,E,1,04,4.4,3.2,M,23.3,M,,0000*56',
		navinfo = '$GPRMC,212348.903,A,5920.4333,N,01800.5179,E,3.00,89.60,260312,,,A*50';

		//console.log(nmea.parse(fix));
	
	/*beforeEach(function() {
		gps = require('../lib/gps').create();
	});*/

	/*afterEach(function() {
		gps.clearListeners();
	});*/

	describe('on("data")', function() {
		it('should fire on each line', function(done) {

			var gps = require('../lib/gps').create();
			
			gps.on('data', function(data) {
				expect(data).to.equal(fix);
				done();
			});

			gps._ondata(fix);
		});
	});

	describe('on("nmea")', function() {
		it('should fire on each line and return an object', function(done) {

			var gps = require('../lib/gps').create();

			gps.on('nmea', function(data) {
				expect(data).to.eql(nmea.parse(fix));
				done();
			});

			gps._ondata(fix);
		});
	});

	describe('on("fix")', function() {
		it('should fire on each fix event', function(done) {

			var gps = require('../lib/gps').create();

			gps.on('fix', function(data) {
				expect(data.type).to.equal('fix');
				done();
			});
			gps._ondata(fix);
			gps._ondata(navinfo);

		});

		it('should convert lat/lon to decimal format', function(done) {
			
			var lat, lon;

			var gps = require('../lib/gps').create();

			// this should fire first
			gps.on('nmea', function(data) {
				lat = utils.convertNmeaToDecimal(data.lat);
				lon = utils.convertNmeaToDecimal(data.lon);
			});

			//so this assertion should work
			gps.on('fix', function(data) {
				expect(data.lat).to.equal(lat);
				expect(data.lon).to.equal(lon);
				done();
			});

			gps._ondata(fix);
		});
	});

	describe('on("nav-info")', function() {
		it('should fire on each nav-info event', function(done) {

			var gps = require('../lib/gps').create();
			
			gps.on('nav-info', function(data) {
				expect(data.type).to.equal('nav-info');
				done();
			});
			gps._ondata(fix);
			gps._ondata(navinfo);

		});
	});

});