// gps-tracker-tests.js

var vows = require('vows'),
    assert = require('assert');

var tracker = require('../gpsTracker.js').createTracker();

// Create a Test Suite
vows.describe('GpsTracker').addBatch({
    'when converting NMEA 0302.78469 to decimal': {
        topic: function () { return '0302.78469' },

        'we get 3.046412': function (topic) {
            assert.equal (tracker.nmeaToDecimal(topic), 3.046412);
        }
    },
    'when converting NMEA 10141.82531 to decimal': {
        topic: function () { return 0 / 0 },

        'we get 101.6971': {
            'is not a number': function (topic) {
                assert.equal (tracker.nmeaToDecimal(topic), 101.6971);
            }
        }
    }
}).run(); // Run it
