$(document).ready () ->
	
	map = new rbb.Map()
	joystick = new rbb.Joystick $('#control')[0]

	map.initialize $('#map')

	socket = window.socket = io.connect location.href

	socket.on 'connect', () ->
		console.log 'socket.io connected'

	socket.on 'gps', (data) ->
		if data.type is 'nav-info'
			map.drawArrow data.lat, data.lon, data.trackTrue, data.speedKnots
		if data.type is 'fix'
			map.setPosition data.lat, data.lon, data.horDilution
			

	joystick.initialize socket

	$('.gps-connect').click () ->
		socket.emit 'gps.connect', (err) ->
			if err?
				alert err
			else
				$('.gps-connect').value = 'Disconnect'

	this