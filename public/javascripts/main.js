(function() {
  var map;

  map = new rbb.Map();

  $(document).ready(function() {
    map.initialize(document.getElementById('map_canvas'));
    now.ready(function() {
      var _this = this;
      console.log('ready');
      now.gps.onFix = function(err, data) {
        console.log(data);
        return map.setPosition(data.lat, data.lon, data.horDilution);
      };
      return now.gps.onSatelliteList = function(err, data) {
        return console.log(data);
      };
    });
    $('.gps-connect').click(function() {
      return now.gps.connect(function(err) {
        if (err != null) {
          return alert(err);
        } else {
          return $('.gps-connect').value = 'Disconnect';
        }
      });
    });
    return this;
  });

}).call(this);
