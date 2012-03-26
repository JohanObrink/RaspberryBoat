vows = require 'vows'
assert = require 'assert'
nmea = require 'nmea'

# Test suite
vows.describe('GpsTracker').addBatch({
    'when converting $GPRMC,002407.060,V,,,,,,,150209,,,N*45 to nmea': {
        topic: () ->
            nmea.parse '$GPRMC,002407.060,V,,,,,,,150209,,,N*45'

        ,'we get 2407.06': (topic) ->
            assert.equal 2407.06, parseFloat topic.timestamp
    }
}).export module