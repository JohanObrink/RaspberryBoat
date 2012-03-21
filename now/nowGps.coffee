class NowGps

	constructor: (@now) ->
		@tracker = require('../gps/testTracker.js').createTracker './files/test.log', true
		
		@now.gps = {
			connect: (callback) ->
				@connect callback
			disconnect: () ->
				@disconnect
		}

		@setupListeners @now.gps

	connect: (callback) ->
		@tracker.connect '/dev/cu.usbserial', 4800, (err) ->
			unless !err
				console.log err
			else
				console.log Connected

			callback(err) unless !callback

	disconnect: () ->
		@tracker.disconnect()

	setupListeners: (gps) ->

		# satellite list
		@tracker.onSatelliteList = (err, data) ->
			gps.onSatelliteList(err, data) unless !gps.onSatelliteList

		# fix
		@tracker.onFix = (err, data) ->
			gps.onFix(err, data) unless !gps.onFix

module.exports.connect = (now) ->
	console.log 'connect NowGps to ' + now
	new NowGps(now)