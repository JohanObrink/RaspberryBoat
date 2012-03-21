(function() {
  var NowGps;

  NowGps = (function() {

    function NowGps(now) {
      this.now = now;
      this.tracker = require('../gps/testTracker.js').createTracker('./files/test.log', true);
      this.now.gps = {
        connect: function(callback) {
          return this.connect(callback);
        },
        disconnect: function() {
          return this.disconnect;
        }
      };
      this.setupListeners(this.now.gps);
    }

    NowGps.prototype.connect = function(callback) {
      return this.tracker.connect('/dev/cu.usbserial', 4800, function(err) {
        if (!!err) {
          console.log(err);
        } else {
          console.log(Connected);
        }
        if (!!callback) return callback(err);
      });
    };

    NowGps.prototype.disconnect = function() {
      return this.tracker.disconnect();
    };

    NowGps.prototype.setupListeners = function(gps) {
      this.tracker.onSatelliteList = function(err, data) {
        if (!!gps.onSatelliteList) return gps.onSatelliteList(err, data);
      };
      return this.tracker.onFix = function(err, data) {
        if (!!gps.onFix) return gps.onFix(err, data);
      };
    };

    return NowGps;

  })();

  module.exports.connect = function(now) {
    console.log('connect NowGps to ' + now);
    return new NowGps(now);
  };

}).call(this);
