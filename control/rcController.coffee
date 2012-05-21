
class RcController

	constructor: () ->
		@usbmaestro = require 'usbmaestro'
		@usbmaestro.connect()

	set: (throttle, rudder) ->
		r = 1500 - (rudder * 250)
		@usbmaestro.setTarget 0, r
		console.log "throttle: #{throttle}, rudder: #{rudder}, adjusted rudder: #{r}"

exports.createController = () ->
	new RcController()
