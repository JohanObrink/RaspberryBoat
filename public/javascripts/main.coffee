map = new rbb.Map()
joystick = null

$(document).ready () ->
	#map.initialize $('#map_canvas')
	joystick = new rbb.Joystick $('#control')[0], now

	now.ready () ->
		console.log 'ready'

		###now.gps.on 'nmea', (err, data) ->
			console.log data###

		now.gps.on 'nav-info', (err, data) ->
			map.drawArrow data.lat, data.lon, data.trackTrue, data.speedKnots

		now.gps.on 'fix', (err, data) ->
			map.setPosition data.lat, data.lon, data.horDilution

	$('.gps-connect').click () ->
		now.gps.connect (err) ->
			if err?
				alert err
			else
				$('.gps-connect').value = 'Disconnect'

	this