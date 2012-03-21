vows = require 'vows'
assert = require 'assert'
tracker = require('../gps/testTracker.js').createTracker './files/test.log'

# Test suite
vows.describe('TestTracker').addBatch({
    'when converting NMEA 0302.78469 to decimal': {
        topic: () ->
            tracker.nmeaToDecimal '0302.78469'

        ,'we get 3.0464115': (topic) ->
            assert.equal topic, 3.0464115
    },
    'when converting NMEA 10141.82531 to decimal': {
        topic: ()->
            tracker.nmeaToDecimal '10141.82531'

        ,'we get 101.6970885': (topic) ->
            assert.equal topic, 101.6970885
    }
}).export module