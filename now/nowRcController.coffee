class NowRcController

	constructor: (@now) ->
		@controller = require('../control/rcController.js').createController()

	connect: (callback) =>

	disconnect: () =>

	set: (throttle, rudder) =>
		@controller.set(throttle, rudder)

module.exports.connect = (now) ->
	now.controller = new NowRcController(now)