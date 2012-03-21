Tracker = require('./gpsTracker.js').Tracker
nmea = require 'nmea'

class TestTracker extends Tracker

	constructor: (@file, @looped) ->
		@reset()

	connect: (path, baud, callback) ->
	    callback null
	    @readLine()
	    this

    disconnect: () ->
    	clearTimeout @timeout

	reset: () ->
		@flr = require('../fileLineReader/fileLineReader.js').createReader @file
		@lastTimestamp = null

	readLine: () =>
		unless @flr.eof()
			line = @flr.readLine()
			data = nmea.parse line

			if !data
				console.log 'Line end'
				return

			if !data.timestamp
				@onData line
				setTimeout @readLine, 5
				return
			else
				now = parseFloat data.timestamp
				if !@lastTimestamp
					timeout = 5
				else
					timeout = Math.max 1000 * (now - @lastTimestamp), 5
				
				@lastTimestamp = now
			
			@timeout = setTimeout @emitLine, timeout, line
		else
			console.log 'Line end'
			if @looped
				@reset()
				@connect(null, null, () ->)

		this

	emitLine: (line) =>
		@onData line
		@readLine()

exports.createTracker = (file, looped) ->
  new TestTracker(file, looped) 