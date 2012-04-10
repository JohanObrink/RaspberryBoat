(function() {
  var TestTracker, Tracker, nmea,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tracker = require('./gpsTracker.js').Tracker;

  nmea = require('nmea');

  TestTracker = (function(_super) {

    __extends(TestTracker, _super);

    function TestTracker(file, looped) {
      this.file = file;
      this.looped = looped;
      this.emitLine = __bind(this.emitLine, this);
      this.readLine = __bind(this.readLine, this);
      this.reset();
    }

    TestTracker.prototype.connect = function(path, baud, callback) {
      callback(null);
      this.readLine();
      return this;
    };

    TestTracker.prototype.disconnect = function() {
      return clearTimeout(this.timeout);
    };

    TestTracker.prototype.reset = function() {
      this.flr = require('../fileLineReader/fileLineReader.js').createReader(this.file);
      return this.lastTimestamp = null;
    };

    TestTracker.prototype.readLine = function() {
      var data, line, now, timeout;
      if (!this.flr.eof()) {
        line = this.flr.readLine();
        data = nmea.parse(line);
        if (!data) {
          console.log('Line end');
          return;
        }
        if (!data.timestamp) {
          this.onData(line);
          setTimeout(this.readLine, 5);
          return;
        } else {
          now = parseFloat(data.timestamp);
          if (!this.lastTimestamp) {
            timeout = 5;
          } else {
            timeout = Math.min(Math.max(1000 * (now - this.lastTimestamp), 5), 1000);
          }
          this.lastTimestamp = now;
        }
        this.timeout = setTimeout(this.emitLine, timeout, line);
      } else {
        console.log('Line end');
        if (this.looped) {
          this.reset();
          this.connect(null, null, function() {});
        }
      }
      return this;
    };

    TestTracker.prototype.emitLine = function(line) {
      this.onData(line);
      return this.readLine();
    };

    return TestTracker;

  })(Tracker);

  exports.createTracker = function(file, looped) {
    return new TestTracker(file, !!looped);
  };

}).call(this);