(function() {
  var Tracker, nmea, serialport,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  serialport = require('serialport');

  nmea = require('nmea');

  Tracker = (function() {

    function Tracker() {
      this.onData = __bind(this.onData, this);
    }

    Tracker.prototype.connect = function(path, baud, callback) {
      var port;
      try {
        port = new serialport.SerialPort(path, {
          baudrate: baud,
          parser: serialport.parsers.readline('\r\n')
        });
        callback(null);
        port.on('data', this.onData);
      } catch (err) {
        callback(err);
      }
      return this;
    };

    Tracker.prototype.disconnect = function() {
      delete port;
      return this;
    };

    Tracker.prototype.on = function(type, callback) {
      if (this.callbacks == null) this.callbacks = {};
      this.callbacks[type] = callback;
      return this;
    };

    Tracker.prototype.call = function(type, err, data) {
      var _ref;
      if (((_ref = this.callbacks) != null ? _ref[type] : void 0) != null) {
        this.callbacks[type](err, data);
      }
      return this;
    };

    Tracker.prototype.onData = function(line) {
      var data;
      this.call('data', null, line);
      data = nmea.parse(line);
      if (data != null) {
        switch (data.type) {
          case 'satellite-list-partial':
            return this.parseSatelliteListMessage(data);
          case 'fix':
            if (!!data.lon && !!data.lat) {
              data.lat = this.nmeaToDecimal(data.lat);
              data.lon = this.nmeaToDecimal(data.lon);
              return this.call('fix', null, data);
            }
        }
      }
    };

    Tracker.prototype.parseSatelliteListMessage = function(data) {
      if (this.satelliteListPartial != null) {
        this.satelliteListPartial.satellites = this.satelliteListPartial.satellites.concat(data.satellites);
      } else {
        this.satelliteListPartial = data;
      }
      if (this.satelliteListPartial.numMsgs === data.msgNum) {
        this.satelliteListPartial.msgNum = data.msgNum;
        this.call('satellite-list', null, this.satelliteListPartial);
        return this.satelliteListPartial = null;
      }
    };

    Tracker.prototype.nmeaToDecimal = function(val) {
      var deg, min;
      deg = val.substring(0, val.indexOf('.') - 2);
      min = val.substring(deg.length);
      return parseInt(deg, 10) + (parseFloat(min) / 60);
    };

    return Tracker;

  })();

  exports.Tracker = Tracker;

  exports.createTracker = function() {
    return new Tracker();
  };

}).call(this);
