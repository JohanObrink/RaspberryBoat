(function() {
  var assert, flr, fs, vows;

  vows = require('vows');

  assert = require('assert');

  fs = require('fs');

  flr = require('../fileLineReader.js');

  vows.describe('FileLineReader').addBatch({
    'when reading two lines separated by \\r': {
      topic: function() {
        var rtxt;
        rtxt = 'Hello\rWorld';
        fs.writeFileSync('testr.txt', rtxt);
        return flr.createReader('testr.txt');
      },
      'we get two lines': function(reader) {
        assert.equal(reader.readLine(), 'Hello');
        assert.equal(reader.readLine(), 'World');
        return assert.equal(reader.eof(), true);
      },
      teardown: function() {
        return fs.unlinkSync('testr.txt');
      }
    },
    'when reading two lines separated by \\n': {
      topic: function() {
        var ntxt;
        ntxt = 'Hello\nWorld';
        fs.writeFileSync('testn.txt', ntxt);
        return flr.createReader('testn.txt');
      },
      'we get two lines': function(reader) {
        assert.equal(reader.readLine(), 'Hello');
        assert.equal(reader.readLine(), 'World');
        return assert.equal(reader.eof(), true);
      },
      teardown: function() {
        return fs.unlinkSync('testn.txt');
      }
    },
    'when reading two lines separated by \\r\\n': {
      topic: function() {
        var rntxt;
        rntxt = 'Hello\r\nWorld';
        fs.writeFileSync('testrn.txt', rntxt);
        return flr.createReader('testrn.txt');
      },
      'we get two lines': function(reader) {
        assert.equal(reader.readLine(), 'Hello');
        assert.equal(reader.readLine(), 'World');
        return assert.equal(reader.eof(), true);
      },
      teardown: function() {
        return fs.unlinkSync('testrn.txt');
      }
    }
  })["export"](module);

}).call(this);
