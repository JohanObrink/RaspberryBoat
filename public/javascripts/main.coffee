map = new Map $('#map_canvas')

now.ready () ->

now.fix (data) ->
	console.log data
	map.setPosition data.lat, data.lon, data.horDilution