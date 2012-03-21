map = new rbb.Map()

$(document).ready () ->	
	#map.initialize $('#map_canvas')
	map.initialize document.getElementById 'map_canvas'

	now.ready () ->
		console.log 'ready'
		now.gps.onFix = (data) ->
			console.log data
			map.setPosition data.lat, data.lon, data.horDilution

	this