nowjs = require 'now'

class Now
	
	constructor: (app) ->
		everyone = nowjs.initialize app
		require('./now/nowGps.js').connect everyone.now

module.exports.connect = (app) ->
	new Now(app)