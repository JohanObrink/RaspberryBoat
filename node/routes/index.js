
var fs = require('fs');
var path = require('path');
var util = require('util');
var gstreamer = require('../lib/gstreamer').create({ source: '/dev/video0' });

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.video = {
  front: function(req, res) {
    gstreamer.addRequest(req, res);
  }
};
