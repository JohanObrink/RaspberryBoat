// Generated by CoffeeScript 1.3.3
(function() {

  $(document).ready(function() {
    var joystick, map, socket;
    map = new rbb.Map();
    joystick = new rbb.Joystick($('#control')[0]);
    map.initialize($('#map'));
    socket = window.socket = io.connect(location.href);
    socket.on('connect', function() {
      return console.log('socket.io connected');
    });
    socket.on('gps.data', function(data) {
      if (data.type === 'nav-info') {
        map.drawArrow(data.lat, data.lon, data.trackTrue, data.speedKnots);
      }
      if (data.type === 'fix') {
        return map.setPosition(data.lat, data.lon, data.horDilution);
      }
    });
    joystick.initialize(socket);
    $('.gps-connect').click(function() {
      return socket.emit('gps.connect', function(err) {
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
