
class RcController

	constructor: () ->

	set: (throttle, rudder) ->
		console.log "throttle: #{throttle}, rudder: #{rudder}"

exports.createController = () ->
	new RcController()