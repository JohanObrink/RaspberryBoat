
var fs = require('fs');
var path = require('path');
var util = require('util');
var gsFront = require('../lib/gstreamer').create({ source: '/dev/video0' });
var gsBack = require('../lib/gstreamer').create({ source: '/dev/video1' });

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.video = {
  front: function(req, res) {
    gsFront.addRequest(req, res);
  },
  back: function(req, res) {
    gsBack.addRequest(req, res);
  }
};
