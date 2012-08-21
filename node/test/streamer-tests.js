var should = require('should'),
	fs = require('fs'),
	JpegStreamBuffer = require('../lib/jpegstreambuffer'),
	EventEmitter = require('events').EventEmitter;	

var streamer, input;

var jpegStart 	= new Buffer( [0xff, 0xd8, 0xff, 0xee] ),
	jpegEnd 	= new Buffer( [0xff, 0xd9] ),
	jpegData	= new Buffer( [0x15, 0x2, 0xb7, 0x74, 0x4b, 0x6d, 0x57, 0xc5, 0xf6, 0x86] );
	jpegData2	= new Buffer( [0xb9, 0xf7, 0x3a, 0xae, 0xd8, 0xed, 0x6c, 0x3d, 0x9b, 0xa7] );

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

			input.emit('data', Buffer.concat([jpegData,jpegStart]));
			streamer._currentStreamPointer.should.equal(jpegStart.length);

		});

		it('should ignore JPEG end before start',function(){
			input.emit('data', jpegEnd);
			streamer._currentStreamPointer.should.equal(-1);
		});

		it('should identify JPEG end marker at end',function(done){
			var img = Buffer.concat([jpegStart,jpegData,jpegEnd]);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', img);
		});

		it('should identify JPEG end marker at mid stream',function(done){
			var img = Buffer.concat([jpegStart,jpegData,jpegEnd]);
			var buf = Buffer.concat([jpegData,img,jpegData]);
			
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

			var img = Buffer.concat([buf1,buf2,buf3]);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', buf1);
			input.emit('data', buf2);
			input.emit('data', buf3);
		});


		it('should handle stream with End, Start, End with closed jpeg', function(done) {
			var img = Buffer.concat([jpegStart,jpegData,jpegEnd]);
			var buf1 = Buffer.concat([jpegData2,jpegEnd,jpegStart,jpegData]);
			var buf2 = Buffer.concat([jpegEnd]);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(img);
				done();
			});

			input.emit('data', buf1);
			input.emit('data', buf2);
		});

	
		it('should handle stream with End, Start, End with open jpeg', function(done) {
			var img1 =Buffer.concat([jpegStart,jpegData2,jpegData2,jpegEnd]); 
			var img2 = Buffer.concat([jpegStart,jpegData,jpegData,jpegEnd]);
			var imgs = [img1, img2];
			
			var buf1 = Buffer.concat([jpegStart,jpegData2]);
			var buf2 = Buffer.concat([jpegData2,jpegEnd,jpegStart,jpegData,jpegEnd]);
			var buf3 = Buffer.concat([jpegStart,jpegData,jpegData,jpegEnd]);

			streamer.on('data',function(jpeg){
				jpeg.should.eql(imgs.shift());
				if(imgs.length==0)done();
			});

			input.emit('data', buf1);
			input.emit('data', buf2);
			input.emit('data', buf3);
		});
		

		describe('#getLatest', function() {

			it('should dispatch latest JPEG image',function(done){
				var img = Buffer.concat([jpegStart,jpegData,jpegEnd]);

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