(function() {
  var NowGps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NowGps = (function() {

    function NowGps(now) {
      var _this = this;
      this.now = now;
      this.disconnect = __bind(this.disconnect, this);
      this.connect = __bind(this.connect, this);
      this.tracker = require('../gps/testTracker.js').createTracker('./files/test.log', true);
      this.tracker.on('satellite-list', function(err, data) {
        console.log('got satellites');
        if (!!_this.now.gps.onSatelliteList) {
          return _this.now.gps.onSatelliteList(err, data);
        } else {
          return console.log('Noone is listening for satelliteList: ' + _this.now.gps.onSatelliteList);
        }
      });
      this.tracker.on('fix', function(err, data) {
        console.log('got fix');
        if (!!_this.now.gps.onFix) {
          return _this.now.gps.onFix(err, data);
        } else {
          return console.log('Noone is listening for fix: ' + _this.now.gps.onFix);
        }
      });
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

    return NowGps;

  })();

  module.exports.connect = function(now) {
    return now.gps = new NowGps(now);
  };

}).call(this);
