"use strict";
var should = require('should'),
	nmea = require('nmea'),
	utils = require('../lib/utils');

describe('Gps', function() {

	var gps = null,
		fix = '$GPGGA,212349.903,5920.4333,N,01800.5195,E,1,04,4.4,3.2,M,23.3,M,,0000*56',
		navinfo = '$GPRMC,212348.903,A,5920.4333,N,01800.5179,E,3.00,89.60,260312,,,A*50';

		//console.log(nmea.parse(fix));
	
	beforeEach(function() {
		gps = require('../lib/gps').create();
	});

	afterEach(function() {
		gps.clearListeners();
	});

	/*describe('on("data")', function() {
		it('should fire on each line', function(done) {
			
			gps.on('data', function(err, data) {
				data.should.equal(fix);
				done();
			});

			gps.ondata(fix);
		});
	});*/

	describe('on("nmea")', function() {
		it('should fire on each line and return an object', function(done) {

			gps.on('nmea', function(err, data) {
				data.should.eql(nmea.parse(fix));
				done();
			});

			gps.ondata(fix);
		});
	});

	describe('on("fix")', function() {
		it('should fire on each fix event', function(done) {

			gps.on('fix', function(err, data) {
				data.type.should.equal('fix');
				done();
			});
			gps.ondata(fix);
			gps.ondata(navinfo);

		});

		it('should convert lat/lon to decimal format', function(done) {
			
			var lat, lon;

			// this should fire first
			gps.on('nmea', function(err, data) {
				lat = utils.convertNmeaToDecimal(data.lat);
				lon = utils.convertNmeaToDecimal(data.lon);
			});

			//so this assertion should work
			gps.on('fix', function(err, data) {
				data.lat.should.equal(lat);
				data.lon.should.equal(lon);
				done();
			});

			gps.ondata(fix);
		});
	});

	describe('on("nav-info")', function() {
		it('should fire on each nav-info event', function(done) {

			gps.on('nav-info', function(err, data) {
				data.type.should.equal('nav-info');
				done();
			});
			gps.ondata(fix);
			gps.ondata(navinfo);

		});
	});

});