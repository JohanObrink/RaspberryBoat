fs = require 'fs'

class GpsLogger
	constructor: (@tracker, filePath) ->
		@stream = fs.createWriteStream filePath, { flags: 'a', encoding: 'utf-8', mode: 0666 }
		@tracker.on 'data', @log
		#@rows = 0

	log: (err, data) =>
		if err?
			console.log 'Error: ' + err
		else
			@stream.write data + '\r'
			#console.log @rows++

exports.createLogger = (tracker, filePath) ->
	new GpsLogger tracker, filePath