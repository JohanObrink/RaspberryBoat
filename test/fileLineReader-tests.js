var expect = require('chai').expect,
	fs = require('fs'),
	flr = require('../lib/fileLineReader');

describe('FileLineReader', function() {

	before(function() {
		var txt;
		
		// create text file with \r
		txt = 'Hello\rWorld';
		fs.writeFileSync('test_r.txt', txt);

		// create text file with \r
		txt = 'Hello\nWorld';
		fs.writeFileSync('test_n.txt', txt);

		// create text file with \r
		txt = 'Hello\r\nWorld';
		fs.writeFileSync('test_rn.txt', txt);
	});

	after(function() {
		// remove text files
		fs.unlinkSync('test_r.txt');
		fs.unlinkSync('test_n.txt');
		fs.unlinkSync('test_rn.txt');
	});


	describe('when reading two lines separated by \\r', function() {

		it('should return two lines', function() {
			var reader = flr.create('test_r.txt');

			expect(reader.readLine()).to.equal('Hello');
			expect(reader.readLine()).to.equal('World');
			expect(reader.eof()).to.be.true;
		});

	});

	describe('when reading two lines separated by \\n', function() {

		it('should return two lines', function() {
			var reader = flr.create('test_n.txt');

			expect(reader.readLine()).to.equal('Hello');
			expect(reader.readLine()).to.equal('World');
			expect(reader.eof()).to.be.true;
		});

	});

	describe('when reading two lines separated by \\r\\n', function() {

		it('should return two lines', function() {
			var reader = flr.create('test_rn.txt');

			expect(reader.readLine()).to.equal('Hello');
			expect(reader.readLine()).to.equal('World');
			expect(reader.eof()).to.be.true;
		});

	});

});