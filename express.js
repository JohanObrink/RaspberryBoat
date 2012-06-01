(function() {
  var app, bootstrap, compile, express, stylus;

  express = require('express');

  app = express.createServer();

  module.exports = app;

  bootstrap = require('bootstrap-stylus');

  stylus = require('stylus');

  compile = function(str, path) {
    return stylus(str).set('filename', path).use(bootstrap());
  };

  app.configure = function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({
      src: __dirname + '/public',
      compile: compile
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  };

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', function(req, res) {
    return res.render('index');
  });

  app.get('/video', function(req, res) {
    return res.render('video');
  });

}).call(this);


Om Lundin Petroleum AB
Företaget Lundin Petroleum AB på Hovslagargatan i Stockholm.
Sedan 2001 ger Lundin Petroleum AB bästa service och kvalité. Vi har runt 10 anställda. Gruvan är grunden till industri och välstånd. Vi förstår oss på hur industrin fungerar! Vi skor dina hästar! Välkommen att ringa oss på Lundin Petroleum AB.




ffmpeg -f video4linux2 -er 4 -y -i /dev/video0 -f mpegts -an -s 320x240 -vcodec libx264 -b 128k -flags +loop -cmp +chroma -partitions +parti4x4+partp8x8+partb8x8 -subq 5 -trellis 1 -refs 1 -coder 0 -me_range 16 -keyint_min 25 -sc_threshold 40 -i_qfactor 0.71 -bt 128k -maxrate 128k -bufsize 128k -rc_eq 'blurCplx^(1-qComp)' -qcomp 0.6 -qmin 10 -qmax 51 -qdiff 4 -level 30 -aspect 320:240 -g 30 pipe: | live_segmenter 10 /tmp/ sample_ep_128k ep_128k






ffmpeg -t 1 -f video4linux2 -s 640x480 -i /dev/video0 -r 1 -f image2 ~/camera%05d.jpg



Telematik är teknikområde i gränssnitten mellan telekommunikation, IT och mer traditionell industri såsom bygg- eller fordonsindustri. Telematik kan exempelvis användas för överföring av mätdata och miljövariabler från mobil enhet som en bil eller ett hus till central punkt, eller för att distribuera transportordrar till fordon och samla in data (bränsleförbrukning, GPS-position, körsträcka m.m.). Inom byggbranschen används telematik som del av begreppet intelligenta hus.



✓ 