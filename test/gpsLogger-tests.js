var expect = require('chai').expect,
	EventEmitter = require('events').EventEmitter;

describe('GPSLogger', function() {
	
	var gps, logger, stream;

	var dataRows = [
		'$GPRMC,212400.000,A,5920.4343,N,01800.5355,E,2.84,86.17,260312,,,A*58',
		'$GPGGA,212401.000,5920.4344,N,01800.5371,E,1,05,3.9,6.3,M,23.3,M,,0000*50',
		'$GPGSA,A,3,04,25,12,31,02,,,,,,,,7.5,3.9,6.4*38'
	];

	beforeEach(function() {
		
		gps = new EventEmitter();

		stream = {
			data: '',
			write: function(data) {
				this.data += data;
			}
		};

		logger = require('../lib/gpsLogger').attach(gps, stream);
	
	});

	it('should write data from the GPS when started', function(done) {

		logger.start();
		
		for(var i=0; i<dataRows.length; i++) {

			gps.emit('data', dataRows[i]);

		}

		setTimeout(function() {
			expect(stream.data).to.eql(dataRows.join('\r') + '\r');
			done();
		}, 10);
	
	});

	it('should not write data from the GPS when stopped', function(done) {

		logger.start();
		
		for(var i=0; i<dataRows.length; i++) {

			gps.emit('data', dataRows[i]);

		}

		logger.stop();

		gps.emit('data', 'foo');

		setTimeout(function() {
			expect(stream.data).to.eql(dataRows.join('\r') + '\r');
			done();
		}, 10);
	
	});

});