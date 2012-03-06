(function() {
  var Tracker, nmea, serialport,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  serialport = require('serialport');

  nmea = require('nmea');

  Tracker = (function() {

    function Tracker() {
      this.parseSatelliteListMessage = __bind(this.parseSatelliteListMessage, this);
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
      } catch (error) {
        callback(error);
      }
      return this;
    };

    Tracker.prototype.onSatelliteList = function(callback) {
      return this.satelliteListCallback = callback;
    };

    Tracker.prototype.onFix = function(callback) {
      return this.fixCallback = callback;
    };

    Tracker.prototype.onData = function(line) {
      var data;
      data = nmea.parse(line);
      if (!!data) {
        switch (data.type) {
          case 'satellite-list-partial':
            return this.parseSatelliteListMessage(data);
          case 'fix':
            if (!!this.fixCallback) return this.fixCallback(null, data);
        }
      }
    };

    Tracker.prototype.parseSatelliteListMessage = function(data) {
      if (!this.satelliteListPartial) {
        this.satelliteListPartial = data;
      } else {
        this.satelliteListPartial.satellites = this.satelliteListPartial.satellites.concat(data.satellites);
      }
      if (this.satelliteListPartial.numMsgs === data.msgNum) {
        this.satelliteListPartial.msgNum = data.msgNum;
        this.satelliteListCallback(null, this.satelliteListPartial);
        return this.satelliteListPartial = null;
      }
    };

    return Tracker;

  })();

  module.exports = Tracker;

}).call(this);