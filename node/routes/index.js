
var fs = require('fs');
var path = require('path');
var util = require('util');
var gstreamer = require('../lib/gstreamer').create();

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.video = {
  front: function(req, res) {
    gstreamer.addRequest(req, res);
    /*var filePath = path.join(__dirname, '../public/img/video_front_placeholder.jpg');
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    util.pump(readStream, res);*/
  }
};