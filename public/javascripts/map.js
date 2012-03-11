(function() {

  module('rbb');

  rbb.Map = (function() {

    function _Class() {}

    _Class.prototype.initialize = function(canvas) {
      var options;
      this.canvas = canvas;
      options = {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.canvas, options);
      return this.map.setCenter(new google.maps.LatLng(59.340832, 18.011712));
    };

    _Class.prototype.setPosition = function(lat, lon, presicion) {
      var pos;
      pos = new google.maps.LatLng(lat, lon);
      if (this.map != null) {
        if (this.marker == null) {
          this.marker = new google.maps.Marker({
            position: pos,
            map: this.map
          });
        } else {
          this.marker.setPosition(pos);
        }
        if (typeof precision !== "undefined" && precision !== null) {
          if (this.circle == null) {
            return this.circle = new google.maps.Circle({
              strokeColor: '#0000cc',
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: '#0000cc',
              fillOpacity: 0.35,
              map: map,
              center: pos,
              radius: 10 * precision
            });
          } else {
            this.circle.setRadius(10 * presicion);
            return this.circle.setCenter(pos);
          }
        }
      }
    };

    return _Class;

  })();

}).call(this);
