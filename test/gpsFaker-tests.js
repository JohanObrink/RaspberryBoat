"use strict";
var should = require('should'),
	path = require('path'),
	fs = require('fs'),
	gpsFaker = require('../lib/gpsFaker.js');

describe('gpsFaker', function() {

	var file = 'nmea.txt';
	var faker;
	var dataRows = [
		'$GPRMC,212400.000,A,5920.4343,N,01800.5355,E,2.84,86.17,260312,,,A*58',
		'$GPGGA,212401.000,5920.4344,N,01800.5371,E,1,05,3.9,6.3,M,23.3,M,,0000*50',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38',
		'$GPRMC,212401.000,A,5920.4344,N,01800.5371,E,2.89,86.25,260312,,,A*54',
		'$GPGGA,212402.000,5920.4352,N,01800.5391,E,1,05,3.9,7.7,M,23.3,M,,0000*5F',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38',
		'$GPRMC,212402.000,A,5920.4352,N,01800.5391,E,2.86,88.23,260312,,,A*59',
		'$GPGGA,212403.000,5920.4358,N,01800.5410,E,1,05,3.9,8.9,M,23.3,M,,0000*5B',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38',
		'$GPRMC,212403.000,A,5920.4358,N,01800.5410,E,2.76,89.00,260312,,,A*53',
		'$GPGGA,212404.000,5920.4362,N,01800.5428,E,1,05,3.9,9.7,M,23.3,M,,0000*51',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38',
		'$GPRMC,212404.000,A,5920.4362,N,01800.5428,E,2.82,87.66,260312,,,A*53',
		'$GPGGA,212405.000,5920.4366,N,01800.5445,E,1,05,3.9,10.4,M,23.3,M,,0000*64',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38',
		'$GPGSV,3,1,10,25,81,238,42,12,51,110,43,30,44,277,,02,42,089,45*7E',
		'$GPGSV,3,2,10,31,37,303,41,04,27,048,39,14,25,263,18,10,12,024,*75',
		'$GPGSV,3,3,10,29,05,228,22,20,01,340,*7A'
	];

	beforeEach(function() {
		faker = gpsFaker.create(100); // make each second 1/10 s long
	});

	before(function() {
		fs.writeFileSync(file, dataRows.join('\r'));
	});

	after(function() {
		fs.unlinkSync(file);
	});

	describe('#create', function() {

		it('creates an object with the correct functions', function() {
			faker.should.have.keys('_secondLength', 'reader', 'gps', 'open', 'attach', 'start', 'stop');
		});

		describe('#attach', function() {

			var gps = {};

			it('stores a reference to the gps', function() {
				faker.attach(gps);
				faker.gps.should.equal(gps);
			});
			
			it('overwrites the gps\' connect method', function() {			
				faker.attach(gps);
				gps.should.have.keys('connect');
			});

			afterEach(function() {
				faker.detach();
			});

		});

		describe('#open', function() {

			it('should contain a fileLineReader pointing to the provided file', function() {
				faker.open(file);
				faker.should.have.property('reader');
				faker.reader.path.should.equal(file);
			});

			afterEach(function() {
				faker.close();
			});
		});

		describe('#start', function() {
			describe('when not attached to a gps', function() {
				it('should throw an error', function() {
					faker.open(file);
					(function() { faker.start(); }).should["throw"]();
				});
			});

			describe('when file is not opened', function() {
				it('should throw an error', function() {
					faker.attach({});
					(function() { faker.start(); }).should["throw"]();
				});
			});

			describe('when file and gps are present', function() {

				it('should pump events', function(done) {

					faker.open(file);
					var gps = {
						data: [],
						_ondata: function(line) {

							//Make sure the correct data was recieved
							line.should.equal(dataRows[this.data.length]);
							
							//Save the data
							this.data.push(line);

							//If all lines pushed - done
							if(this.data.length == dataRows.length)
								done();
						}
					};

					faker.attach(gps);
					faker.start();
				});

				it('should not throw an error', function(done) {
					faker.attach({});
					faker.open(file);

					(function() { faker.start(); }).should.not["throw"]();
					done();
				});

				afterEach(function() {
					faker.stop();
					faker.detach();
					faker.close();
				});
			});
		});

	});

});