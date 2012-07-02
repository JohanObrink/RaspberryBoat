var should = require('should'),
	fs = require('fs'),
	JpegStreamBuffer = require('../readablejpegstream'),
	buffer = require('./bufferHelper'),
	EventEmitter = require('events').EventEmitter;	

require('bufferjs/concat');

var streamer, input;

var jpegStart 	= buffer.create( 0xffd8, 0xffee ),
	jpegEnd 	= buffer.create( 0xffd9 ),
	jpegData	= buffer.create( 0x152, 0xb774, 0x4b6d, 0x57c5, 0xf686 );

describe('Streamer', function() {

	it('should extend EventEmitter',function(){
		var streamer = JpegStreamBuffer.create();
		//streamer.super_.should.equal(EventEmitter);

		streamer.should.be.an.instanceof(EventEmitter);
	});

	it('should have a default offset of -1', function() {
		JpegStreamBuffer.create()._currentStreamPointer.should.equal(-1);
	});

	describe('#on data', function() {

		beforeEach(function() {
			input = new EventEmitter();

			streamer = JpegStreamBuffer.create().setInput(input).start();
		});

		it('should identify JPEG start marker as position at start',function(){

			input.emit('data', jpegStart);
			streamer._currentStreamPointer.should.equal(jpegStart.length);

		});

		it('should identify JPEG start marker as position mid stream',function(){

			input.emit('data', Buffer.concat(jpegData,jpegStart));
			streamer._currentStreamPointer.should.equal(jpegStart.length);

		});
		
		it('should ignore JPEG end before start',function(){
			input.emit('data', jpegEnd);
			streamer._currentStreamPointer.should.equal(-1);
		});

		it('should identify JPEG end marker at end',function(done){
			var img = Buffer.concat(jpegStart,jpegData,jpegEnd);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', img);
		});

		it('should identify JPEG end marker at mid stream',function(done){
			var img = Buffer.concat(jpegStart,jpegData,jpegEnd);
			var buf = Buffer.concat(jpegData,img,jpegData);
			
			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', buf);
		});

		it('should identify JPEG data from multiple callbacks',function(done){

			var buf1 = jpegStart;
			var buf2 = jpegData;
			var buf3 = jpegEnd;

			var img = Buffer.concat(buf1,buf2,buf3);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', buf1);
			input.emit('data', buf2);
			input.emit('data', buf3);
		});

		describe('#getLatest', function() {

			it('should dispatch latest JPEG image',function(done){
				var img = Buffer.concat(jpegStart,jpegData,jpegEnd);

				streamer.on('data',function(jpeg){
					jpeg.should.eql(img);
					done();
				});

				input.emit('data', img);
			});
		})

	});

	describe("#on stop pause", function() {
		it('should clear current stream values and pointers', function() {
			streamer.stop();
			streamer._currentStreamPointer.should.equal(-1);
		});

	});

})