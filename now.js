(function() {
  var Now, nowjs;

  nowjs = require('now');

  Now = (function() {

    function Now(app) {
      var everyone;
      everyone = nowjs.initialize(app);
      require('./now/nowGps.js').connect(everyone.now);
      require('./now/nowRcController.js').connect(everyone.now);
    }

    return Now;

  })();

  module.exports.connect = function(app) {
    return new Now(app);
  };

}).call(this);
