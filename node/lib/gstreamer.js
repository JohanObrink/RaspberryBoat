(function() {
	
	var fs				= require('fs'),
		child		 	= require('child_process'),
		jpegStreamer 	= require('./jpegstreambuffer').create(),
		_				= require('underscore');

	var GStreamer = exports.GStreamer = function( settings ) {
		this.responsePool = [];
		this.settings = {
			framerate: 3,
			width: 640,
			height: 360,
			boundary: "livestreamnotlikeapplehttplivestreaming",
			source: "videotestsrc"
		};
		this.childProcess = null;
		
		if ( settings ) {
			for ( var s in settings ) {
				if ( settings[s] && this.settings[s] ) this.settings[s] = settings[s];
			}
		}
		this.imgIndex = 0;

		_.bindAll(this);
	}

	GStreamer.prototype.addRequest = function( req, res ) {
		// Send the header and keep the connection live
		res.writeHead(200, {
			'Content-Type': 'multipart/x-mixed-replace;boundary="' + this.settings.boundary + '"',
			'Connection': 'keep-alive',
			'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
			'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
			'Pragma': 'no-cache'
		});

		res.write("--" + this.settings.boundary + "\n");
		
		// Listen for when the connection is lost and remove the response from the pool
		req.socket.on('end', this.removeRequest);
		this.responsePool.push( res );

		// Start the stream if we don't already have one
		this.startStream();
	}

	GStreamer.prototype.removeRequest = function( res ) {
		console.log('Connection lost, removing from pool');
		this.responsePool.splice(this.responsePool.indexOf(res),1); 
	}

	GStreamer.prototype.startStream = function() {
		if ( this.childProcess != null ) return;

		this.createChildProcess();

		jpegStreamer.on('data', this.onJpegData);
		jpegStreamer.setInput( this.childProcess.stdout ).start();
	}

	GStreamer.prototype.onJpegData = function (data) {
/*		
		this.imgIndex++;
		var fs = require('fs');
		var name = 'img' + this.imgIndex + '.jpg';
		var path = require('path').join(__dirname, '../public/img/' + name);
		fs.writeFile(path, data, function() {
			console.log('wrote ' + path);
		});
*/
		
		for ( var i = 0; i < this.responsePool.length; ++i ) {
			this.responsePool[i].write('Content-Type: image/jpeg\n Content-Length: '+data.length+'\n\n');
			this.responsePool[i].write(data);
			this.responsePool[i].write('\n--'+this.settings.boundary+'\n');
		}
		

	}

	GStreamer.prototype.createChildProcess = function() {
		var args = [
			'-an',
			'-f', 'video4linux2',
			'-vcodec', 'mjpeg',
			'-s', this.settings.width + 'x' + this.settings.height,
			'-r', this.settings.framerate,
			'-i', this.settings.source,
			'-f', 'image2pipe',
			'-'
		]
		this.childProcess = child.spawn("ffmpeg", args, null /*options*/);
		this.childProcess.stderr.on('data', this.onChildProcessError);
		this.childProcess.on('exit', this.onChildProcessExit);
		return this.childProcess;
	}

	GStreamer.prototype.tmpStdout = function(data) {
		console.log("stdout");
	}

	GStreamer.prototype.onChildProcessError = function(data) {
//		console.log("Stderr: " + data.toString());
	}

	GStreamer.prototype.onChildProcessExit = function(code) {
		console.log("Process exited with code: " + code);
		this.childProcess = null;
	}

	module.exports.create = function( options ) {
		return new GStreamer(options);
	}

}).call(this);
