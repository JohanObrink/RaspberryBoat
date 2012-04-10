(function() {

  $(document).ready(function() {
    var joystick, map;
    map = new rbb.Map();
    joystick = new rbb.Joystick($('#control')[0]);
    map.initialize($('#map'));
    now.ready(function() {
      console.log('ready');
      joystick.initialize(now);
      /*now.gps.on 'nmea', (err, data) ->
      			console.log data
      */
      now.gps.on('nav-info', function(err, data) {
        return map.drawArrow(data.lat, data.lon, data.trackTrue, data.speedKnots);
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