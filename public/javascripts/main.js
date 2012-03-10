(function() {
  var map;

  map = new Map($('#map_canvas'));

  now.ready(function() {});

  now.fix(function(data) {
    console.log(data);
    return map.setPosition(data.lat, data.lon, data.horDilution);
  });

}).call(this);
