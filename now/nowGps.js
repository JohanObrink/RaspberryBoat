(function() {
  var NowGps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NowGps = (function() {

    function NowGps(now) {
      this.now = now;
      this.on = __bind(this.on, this);
      this.disconnect = __bind(this.disconnect, this);
      this.connect = __bind(this.connect, this);
      this.tracker = require('../gps/testTracker.js').createTracker('./files/20120326_2322.log', true);
    }

    NowGps.prototype.connect = function(callback) {
      return this.tracker.connect('/dev/cu.usbserial', 4800, function(err) {
        if (!!err) {
          console.log(err);
        } else {
          console.log('Connected');
        }
        if (!!callback) return callback(err);
      });
    };

    NowGps.prototype.disconnect = function() {
      return this.tracker.disconnect();
    };

    NowGps.prototype.on = function(event, callback) {
      return this.tracker.on(event, callback);
    };

    return NowGps;

  })();

  module.exports.connect = function(now) {
    return now.gps = new NowGps(now);
  };

}).call(this);
