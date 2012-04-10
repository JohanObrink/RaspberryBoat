(function() {
  var RcController;

  RcController = (function() {

    function RcController() {}

    RcController.prototype.set = function(throttle, rudder) {
      return console.log("throttle: " + throttle + ", rudder: " + rudder);
    };

    return RcController;

  })();

  exports.createController = function() {
    return new RcController();
  };

}).call(this);
