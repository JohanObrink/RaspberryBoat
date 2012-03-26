fs = require 'fs'

class FileLineReader
	
	constructor: (@path, @encoding) ->
	
		@position = 0
		@_eof = false
		@fd = null
		@saved = null

		if !@encoding
			@encoding = 'ascii'
		@fd = fs.openSync @path, 'r'

	readLine: () ->
		# If end of file - return null
		if @_eof
			return null

		# Read sync seems to move forward without ability to seek
		# so as a workaround seeks are saved for next call
		result = ''
		lf = false

		# Read to line or file end
		while !lf and !@_eof
			# Read one char
			next = fs.readSync @fd, 1, @position++, @encoding

			# If a char was returned
			if next[1] is 1
				c = next[0]

				# If char was line end
				if c is '\r' or c is '\n'

					# If \r\n style lines
					if c is '\r'
						nextChar = fs.readSync(@fd, 1, @position, @encoding)[0]
						if nextChar is '\n'
							@position++
					
					lf = true
				# Append to result
				else
					result += c
			# At end of file
			else
				@_eof = true
			
		result

	eof: () ->
		@_eof

exports.createReader = (path, encoding) ->
	new FileLineReader(path, encoding)