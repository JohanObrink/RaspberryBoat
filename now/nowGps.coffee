class NowGps

	constructor: (@now) ->
		@tracker = require('../gps/testTracker.js').createTracker './files/20120326_2322.log', true

		# satellite list
		@tracker.on 'satellite-list', (err, data) =>
			console.log 'got satellites'
			unless !@now.gps.onSatelliteList
				@now.gps.onSatelliteList err, data
			else
				console.log 'Noone is listening for satelliteList: ' + @now.gps.onSatelliteList

		# fix
		@tracker.on 'fix', (err, data) =>
			console.log 'got fix'
			unless !@now.gps.onFix
				@now.gps.onFix err, data
			else
				console.log 'Noone is listening for fix: ' + @now.gps.onFix

	connect: (callback) =>
		@tracker.connect '/dev/cu.usbserial', 4800, (err) ->
			unless !err
				console.log err
			else
				console.log 'Connected'

			callback(err) unless !callback

	disconnect: () =>
		@tracker.disconnect()

module.exports.connect = (now) ->
	now.gps = new NowGps(now)