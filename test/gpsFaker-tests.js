var should = require('should'),
	path = require('path'),
	fs = require('fs')
	gpsFaker = require('../lib/gpsFaker.js');

describe('gpsFaker', function() {

	var file = 'nmea.txt';

	before(function() {
		fs.writeFileSync(file,
			'$GPRMC,212400.000,A,5920.4343,N,01800.5355,E,2.84,86.17,260312,,,A*58' + '\r' +
			'$GPGGA,212401.000,5920.4344,N,01800.5371,E,1,05,3.9,6.3,M,23.3,M,,0000*50' + '\r' +
			'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38' + '\r' +
			'$GPRMC,212401.000,A,5920.4344,N,01800.5371,E,2.89,86.25,260312,,,A*54' + '\r' +
			'$GPGGA,212402.000,5920.4352,N,01800.5391,E,1,05,3.9,7.7,M,23.3,M,,0000*5F' + '\r' +
			'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38' + '\r' +
			'$GPRMC,212402.000,A,5920.4352,N,01800.5391,E,2.86,88.23,260312,,,A*59' + '\r' +
			'$GPGGA,212403.000,5920.4358,N,01800.5410,E,1,05,3.9,8.9,M,23.3,M,,0000*5B' + '\r' +
			'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38' + '\r' +
			'$GPRMC,212403.000,A,5920.4358,N,01800.5410,E,2.76,89.00,260312,,,A*53' + '\r' +
			'$GPGGA,212404.000,5920.4362,N,01800.5428,E,1,05,3.9,9.7,M,23.3,M,,0000*51' + '\r' +
			'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38' + '\r' +
			'$GPRMC,212404.000,A,5920.4362,N,01800.5428,E,2.82,87.66,260312,,,A*53' + '\r' +
			'$GPGGA,212405.000,5920.4366,N,01800.5445,E,1,05,3.9,10.4,M,23.3,M,,0000*64' + '\r' +
			'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38' + '\r' +
			'$GPGSV,3,1,10,25,81,238,42,12,51,110,43,30,44,277,,02,42,089,45*7E' + '\r' +
			'$GPGSV,3,2,10,31,37,303,41,04,27,048,39,14,25,263,18,10,12,024,*75' + '\r' +
			'$GPGSV,3,3,10,29,05,228,22,20,01,340,*7A');
	});

	after(function() {
		fs.unlinkSync(file);
	});

	describe('#create', function() {

		var faker = gpsFaker.create();

		it('creates an object with the correct functions', function() {
			faker.should.have.keys('reader', 'gps', 'open', 'attach', 'start', 'stop');
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
					(function() { faker.start(); }).should.throw();
					faker.close();
				});
			});

			describe('when file is not opened', function() {
				it('should throw an error', function() {
					faker.attach({});
					(function() { faker.start(); }).should.throw();
					faker.detach();
				});
			});

			describe('when file and gps are present', function() {

				before(function() {
					faker.attach({});
					faker.open(file);
				});

				it('should not throw an error', function() {
					(function() { faker.start(); }).should.not.throw();
				});

				after(function() {
					faker.detach();
					faker.close();
				});
			});
		});

	});

});