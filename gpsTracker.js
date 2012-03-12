(function() {
  var Tracker, nmea, reader, serialport,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  serialport = require('serialport');

  nmea = require('nmea');

  reader = require('./fileLineReader.js').FileLineReader;

  Tracker = (function() {

    function Tracker() {
      this.emitLine = __bind(this.emitLine, this);
      this.readLine = __bind(this.readLine, this);
      this.nmeaToDecimal = __bind(this.nmeaToDecimal, this);
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
      if (data != null) {
        switch (data.type) {
          case 'satellite-list-partial':
            return this.parseSatelliteListMessage(data);
          case 'fix':
            if (this.fixCallback != null) {
              if (!!data.lon && !!data.lat) {
                data.lat = this.nmeaToDecimal(data.lat);
                data.lon = this.nmeaToDecimal(data.lon);
                return this.fixCallback(null, data);
              } else {
                return console.log('No fix');
              }
            } else {
              return console.log('Noone is listening to me!!!');
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
        this.satelliteListCallback(null, this.satelliteListPartial);
        return this.satelliteListPartial = null;
      }
    };

    Tracker.prototype.nmeaToDecimal = function(val) {
      var deg, min;
      deg = val.substring(0, val.indexOf('.') - 2);
      min = val.substring(deg.length);
      return parseInt(deg, 10) + (parseFloat(min) / 60);
    };

    Tracker.prototype.runTest = function() {
      this.flr = new reader('./files/test.log', 200);
      this.readLine();
      return this;
    };

    Tracker.prototype.readLine = function() {
      var data, line, now, timeout;
      if (this.flr.hasNextLine) {
        line = this.flr.nextLine();
        data = nmea.parse(line);
        if (!data) {
          console.log('Line end');
          return;
        }
        if (!data.timestamp) {
          this.onData(line);
          setTimeout(this.readLine, 5);
        } else {
          now = parseFloat(data.timestamp);
          if (!this.lastTimestamp) {
            timeout = 5;
          } else {
            timeout = Math.max(1000 * (now - this.lastTimestamp), 5);
          }
          this.lastTimestamp = now;
          return setTimeout(this.emitLine, timeout, line);
        }
      } else {
        return console.log('Line end');
      }
    };

    Tracker;

    Tracker.prototype.emitLine = function(line) {
      this.onData(line);
      return this.readLine();
    };

    return Tracker;

  })();

  exports.createTracker = function() {
    return new Tracker();
  };

}).call(this);
