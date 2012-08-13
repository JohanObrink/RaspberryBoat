module 'rbb'

rbb.Map = class

	constructor: () ->

	initialize: (@canvas) ->
		options = { zoom: 18, mapTypeId: google.maps.MapTypeId.ROADMAP }
		@map = new google.maps.Map @canvas[0], options
		@map.setCenter new google.maps.LatLng(59.340832, 18.011712)

		this

	setPosition: (lat, lon, precision) ->
		pos = new google.maps.LatLng lat, lon
		if @map?
			@map.setCenter pos
			if !@marker
				@marker = new google.maps.Marker { position: pos, map: @map }
			else
				@marker.setPosition pos

			if !!precision
				if !@circle
					@circle = new google.maps.Circle {
						strokeColor: '#0000cc',
						strokeOpacity: 0.5,
						strokeWeight: 1,
						fillColor: '#0000cc',
						fillOpacity: 0.2,
						map: @map,
						center: pos,
						radius: 10 * precision
					}
				else
					@circle.setRadius(10 * precision)
					@circle.setCenter pos
		this


	drawArrow: (lat, lon, trackTrue, speedKnots) ->
		start = new google.maps.LatLng lat, lon
		metersPerSecond = speedKnots * 0.514444444444444
		end = google.maps.geometry.spherical.computeOffset(start, 20 * metersPerSecond, trackTrue)
		if !@line
			@line = new google.maps.Polyline {
				path: [start, end],
				strokeColor: '#ff0000',
				strokeOpacity: 1.0,
				strokeWeight: 1
			}
			@line.setMap @map
		else
			@line.setPath [start, end]

		this