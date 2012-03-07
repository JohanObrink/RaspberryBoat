// gps-tracker-tests.js

var vows = require('vows'),
    assert = require('assert');
    tracker = require('../gpsTracker.js').createTracker();

// Create a Test Suite
vows.describe('GpsTracker').addBatch({
    'when converting NMEA 0302.78469 to decimal': {
        topic: function() { return tracker.nmeaToDecimal('0302.78469'); },

        'we get 3.0464115': function (topic) {
            assert.equal(topic, 3.0464115);
        }
    },
    'when converting NMEA 10141.82531 to decimal': {
        topic: function() { return tracker.nmeaToDecimal('10141.82531'); },

        'we get 101.6970885': function(topic) {
            assert.equal(topic, 101.6970885);
        }
    }
}).run(); // Run it
