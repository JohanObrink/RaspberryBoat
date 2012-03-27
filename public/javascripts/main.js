(function() {
  var map;

  map = new rbb.Map();

  $(document).ready(function() {
    map.initialize(document.getElementById('map_canvas'));
    now.ready(function() {
      console.log('ready');
      now.gps.on('nmea', function(err, data) {
        return console.log(data);
      });
      return now.gps.on('fix', function(err, data) {
        return map.setPosition(data.lat, data.lon, data.horDilution);
      });
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
