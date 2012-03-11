(function() {
  var map;

  map = new rbb.Map();

  $(document).ready(function() {
    map.initialize(document.getElementById('map_canvas'));
    now.ready(function() {});
    now.fix = function(data) {
      console.log(data);
      return map.setPosition(data.lat, data.lon, data.horDilution);
    };
    return this;
  });

}).call(this);
