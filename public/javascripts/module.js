(function() {
  var global;

  global = window;

  global.module = function(name) {
    return global[name] = global[name] || {};
  };

}).call(this);
