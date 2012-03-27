class NowGps

	constructor: (@now) ->
		@tracker = require('../gps/testTracker.js').createTracker './files/20120326_2322.log', true

	connect: (callback) =>
		@tracker.connect '/dev/cu.usbserial', 4800, (err) ->
			unless !err
				console.log err
			else
				console.log 'Connected'

			callback(err) unless !callback

	disconnect: () =>
		@tracker.disconnect()

	on: (event, callback) =>
		@tracker.on event, callback

module.exports.connect = (now) ->
	now.gps = new NowGps(now)