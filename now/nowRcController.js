(function() {
  var NowRcController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NowRcController = (function() {

    function NowRcController(now) {
      this.now = now;
      this.set = __bind(this.set, this);
      this.disconnect = __bind(this.disconnect, this);
      this.connect = __bind(this.connect, this);
      this.controller = require('../control/rcController.js').createController();
    }

    NowRcController.prototype.connect = function(callback) {};

    NowRcController.prototype.disconnect = function() {};

    NowRcController.prototype.set = function(throttle, rudder) {
      return this.controller.set(throttle, rudder);
    };

    return NowRcController;

  })();

  module.exports.connect = function(now) {
    return now.controller = new NowRcController(now);
  };

}).call(this);
