(function(){

	var EventEmitter	= require('events').EventEmitter;
	var util			= require('util');
	var _				= require('underscore');

	var JpegStreamBuffer = exports.JpegStreamBuffer = function() { 
		this._currentStreamPointer = -1;
		this._stopped = false;

		this._currentJpegData = null;

		// The stream to scan for Jpeg data in
		this.inputStream = null;

		_.bindAll(this);
		EventEmitter.call(this);
	};

	util.inherits(JpegStreamBuffer, EventEmitter);

	JpegStreamBuffer.prototype.setInput = function( input ) {
		this.inputStream = input;
		return this;
	}

	JpegStreamBuffer.prototype.stop = function() {
		this._stopped = true;
		this._currentStreamPointer = -1;

		this.inputStream.removeListener('data', this.onStreamData);
	};

	JpegStreamBuffer.prototype.start = function() {
		this._stopped = false;

		this.inputStream.on('data', this.onStreamData);

		return this;
	};

	JpegStreamBuffer.prototype.sendJpegData = function(jpegBuffer, dataLength) {
		var sizedBuffer = jpegBuffer.slice(0, dataLength);

		var buffer = new Buffer(sizedBuffer.length);
		sizedBuffer.copy(buffer);


		this.emit('data', sizedBuffer);
	};

	JpegStreamBuffer.prototype.onStreamData = function(data) {
		var jpegStart, jpegEnd, safety;
		safety = 0;

		jpegStart = this.findJpegStartMarker(data, 0);
		jpegEnd = this.findJpegEndMarker(data, 0);

		if ( jpegStart != -1 && jpegEnd == -1 ) {
			// new jpeg data with no end marker

			// we're already on a image, throw it away and start a new one
			if ( this._currentStreamPointer != -1 ) {
				this.resetCurrentData();
			}
			this.readJpegData(data, jpegStart, data.length);
		}
		else if ( jpegStart == -1 && jpegEnd != -1 ) {
			// end of jpeg data without start marker

			// only bother about this is we have had a start earliner
			if ( this._currentStreamPointer != -1 ) {
				this.readJpegData(data, 0, jpegEnd+2);

				// we have a complete jpeg data, close it
				this.closeJpegData();
			}	
		}
		else if ( jpegStart != -1 && jpegEnd != -1 ) {
			// both start and end in this buffer

			// see if the end is before the start
			if ( jpegEnd < jpegStart ) {
				
				// We only want this if we already had a current image
				if ( this._currentStreamPointer != -1 ) {
					this.readJpegData(data, 0, jpegEnd+2);
					this.closeJpegData();
				}
				else {
					this.resetCurrentData();
				}
				
				// Start reading the next image
				this.readJpegData(data, jpegStart, data.length);
			}
			else {
				// we're already on a image, throw it away and start a new one
				if ( this._currentStreamPointer != -1 ) {
					this.resetCurrentData();
				}
				
				this.readJpegData(data, jpegStart, jpegEnd+2);
				this.closeJpegData();
			}
		}
		else if ( jpegStart == -1 && jpegEnd == -1 ) {
			// neither start or end markers, read full buffer if we've had a 
			// start marker earlier
			if ( this._currentStreamPointer != -1 ) {
				this.readJpegData(data, 0, data.length);
			}
		}
	};

	JpegStreamBuffer.prototype.closeJpegData = function(){
		this.sendJpegData(this._currentJpegData, this._currentStreamPointer);
		this.resetCurrentData();
	} 

	JpegStreamBuffer.prototype.readJpegData = function(data, start, end) {
		if ( this._currentJpegData == null ) {
			this._currentJpegData = new Buffer( 500000 ); // Allocate space for a new Jpeg data
			this._currentStreamPointer = 0;
		}
				
		data.copy( this._currentJpegData, this._currentStreamPointer, start, end );
		this._currentStreamPointer += end - start;
	};

	JpegStreamBuffer.prototype.resetCurrentData = function () {
		this._currentStreamPointer = -1;
		this._currentJpegData = null;
	}

	JpegStreamBuffer.prototype.findJpegStartMarker = function(buffer, fromOffset) {
		var i =  fromOffset > 0 ? fromOffset*2 : 0; // times 2 since we want to read 2 bytes

		for (; i < buffer.length-1; ++i)
		{
			var soi = buffer.readUInt16BE(i);
			if ( soi == 0xFFD8  )
			{
				var jfif = buffer.readUInt16BE(i+2);
				if ( jfif == 0xFFEE || jfif == 0xFFFE ) {
					return i;
				}
			}
		}

		return -1;
	};

	JpegStreamBuffer.prototype.findJpegEndMarker = function(buffer, fromOffset) {
		var i =  fromOffset > 0 ? fromOffset*2 : 0; // times 2 since we want to read 2 bytes

		for (; i < buffer.length-1; ++i)
		{
			var soi = buffer.readUInt16BE(i);
			
			if ( soi == 0xFFD9 ) {
				return i;
			}
		}

		return -1;
	};	

	exports.create = function( inputStream ) {
		return new JpegStreamBuffer();
	};

}).call(this);
