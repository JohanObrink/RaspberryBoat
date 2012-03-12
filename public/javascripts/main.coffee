map = new rbb.Map()

$(document).ready () ->	
	#map.initialize $('#map_canvas')
	map.initialize document.getElementById 'map_canvas'

	now.ready () ->

	now.fix = (data) ->
		console.log data
		map.setPosition data.lat, data.lon, data.horDilution

	this