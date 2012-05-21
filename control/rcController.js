// Generated by CoffeeScript 1.3.1
(function() {
  var RcController;

  RcController = (function() {

    RcController.name = 'RcController';

    function RcController() {
      this.usbmaestro = require('usbmaestro');
      this.usbmaestro.connect();
    }

    RcController.prototype.set = function(throttle, rudder) {
      var r;
      r = 1500 - (rudder * 250);
      this.usbmaestro.setTarget(0, r);
      return console.log("throttle: " + throttle + ", rudder: " + rudder + ", adjusted rudder: " + r);
    };

    return RcController;

  })();

  exports.createController = function() {
    return new RcController();
  };

}).call(this);
