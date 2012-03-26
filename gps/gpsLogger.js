(function() {
  var GpsLogger, fs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  GpsLogger = (function() {

    function GpsLogger(tracker, filePath) {
      this.tracker = tracker;
      this.log = __bind(this.log, this);
      this.stream = fs.createWriteStream(filePath, {
        flags: 'a',
        encoding: 'utf-8',
        mode: 0666
      });
      this.tracker.on('data', this.log);
    }

    GpsLogger.prototype.log = function(err, data) {
      if (err != null) {
        return console.log('Error: ' + err);
      } else {
        return this.stream.write(data + '\r');
      }
    };

    return GpsLogger;

  })();

  exports.createLogger = function(tracker, filePath) {
    return new GpsLogger(tracker, filePath);
  };

}).call(this);
