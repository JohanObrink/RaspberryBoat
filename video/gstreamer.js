(function() {
	var GStreamer;

	GStreamer = (function(){
		var fs		= require('fs'),
				child	= require('child_process');

		function GStreamer( settings ) {
			this.snapshotIntervalId = 0,
			this.responsePool = [],
			this.settings = {
						snapshotInterval: 500,
						boundary: "livestreamnotlikeapplehttplivestreaming",
						streamSourceJpg: "public/streams/gstreamer.jpg"
					};
			
			for ( var s in settings ) {
				if ( settings[s] && this.settings[s] ) this.settings[s] = settings[s];
			}
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
			var _this = this;
			req.socket.on('end',function(){
				console.log('Connection lost, removing from pool');
				_this.responsePool.splice(_this.responsePool.indexOf(res),1); 
			});
			this.responsePool.push( res );

			// Start the stream if we don't already have one
			this.startStream();
		}

		// private
		GStreamer.prototype.startStream = function() {
			// We already have an interval, return
			if ( this.snapshotIntervalId != 0 ) return;

			var _this = this;
			this.snapshotIntervalId = setInterval(function(){
				if ( _this.responsePool.length == 0 )
				{
					console.log("No connections, pausing");
					clearInterval(_this.snapshotIntervalId);
					_this.snapshotIntervalId = 0;
					return;
				}

				//gst-launch -v videotestsrc num-buffers=1 ! video/x-raw-rgb, width=640, height=480 ! clockoverlay ! jpegenc  ! filesink location=/home/dev/projects/webcam-stream/public/streams/gstreamer.jpg
				var args = [
					'videotestsrc', 'num-buffers=1', 
					'!', 'video/x-raw-rgb, width=640, height=480',
					//'!', 'timeoverlay', 'halign=left', 'valign=bottom', 'text="Stream time:"', 'shaded-background=true',
					'!', 'clockoverlay',
					'!', 'jpegenc',
					'!', 'filesink', 'location=' + _this.settings.streamSourceJpg
				]
				var gstMuxer = child.spawn("gst-launch", args, null /*options*/);
				gstMuxer.stderr.on('data', function(data){
					console.log("Error: " + data.toString());
				});
				gstMuxer.on('exit', function(code){
					if ( code == 0 ) {
						fs.readFile(_this.settings.streamSourceJpg, function(err,data){

							for ( var i = 0; i < _this.responsePool.length; ++i ) {
								_this.responsePool[i].write('Content-Type: image/jpeg\n Content-Length: '+data.length+'\n\n');
								_this.responsePool[i].write(data);
								_this.responsePool[i].write('\n--'+_this.settings.boundary+'\n');
							}
						});
					}
					else {
						console.log("Error: Exit with code: " + code);
					}
				});

			}, this.settings.snapshotInterval );
		}

		return GStreamer;

	})();

	module.exports.create = function( options ) {
		return new GStreamer(options);
	}

}).call(this);