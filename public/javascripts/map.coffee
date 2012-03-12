module 'rbb'

rbb.Map = class

	constructor: () ->

	initialize: (@canvas) ->
		options = { zoom: 18, mapTypeId: google.maps.MapTypeId.ROADMAP }
		@map = new google.maps.Map @canvas, options
		@map.setCenter new google.maps.LatLng(59.340832, 18.011712)

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
						strokeOpacity: 0.8,
						strokeWeight: 1,
						fillColor: '#0000cc',
						fillOpacity: 0.35,
						map: @map,
						center: pos,
						radius: 10 * precision
					}
				else
					@circle.setRadius(10 * precision)
					@circle.setCenter pos