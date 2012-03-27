map = new rbb.Map()

$(document).ready () ->	
	#map.initialize $('#map_canvas')
	map.initialize document.getElementById 'map_canvas'

	now.ready () ->
		console.log 'ready'
		now.gps.onFix = (err, data) =>
			console.log data
			map.setPosition data.lat, data.lon, data.horDilution
		now.gps.onSatelliteList = (err, data) =>
			console.log data

	$('.gps-connect').click () ->
		now.gps.connect (err) ->
			if err?
				alert err
			else
				$('.gps-connect').value = 'Disconnect'

	this