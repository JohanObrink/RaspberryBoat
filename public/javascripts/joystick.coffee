module 'rbb'

rbb.Joystick = class

	constructor: (@canvas, @now) ->

		@resetCanvas()

		@ctx = canvas.getContext '2d'
		@ctx.strokeStyle = '#ffffff'
		@ctx.lineWidth = 2

		@throttleController = null
		@rudderController = null
		@touches = [] # array of touch vectors

		@throttle = 0
		@rudder = 0

		@canvas.addEventListener 'touchstart', @onTouchStart, false
		@canvas.addEventListener 'touchmove', @onTouchMove, false
		@canvas.addEventListener 'touchend', @onTouchEnd, false
		
		window.onorientationchange = @resetCanvas
		window.onresize = @resetCanvas

		setInterval @draw, (1000/35)
		setInterval @send, (1000/5)


	resetCanvas: (e) =>
		# resize the canvas - but remember - this clears the canvas too. 
		@canvas.width = window.innerWidth
		@canvas.height = window.innerHeight
		
		#make sure we scroll to the top left. 
		window.scrollTo 0,0

		e

	send: () =>
		t = 0
		r = 0
		if !!@throttleController
			t = @throttleController.clientY - @throttleController.originY

		if !!@rudderController
			r = @rudderController.clientX - @rudderController.originX

		if t is not @throttle or r is not @rudder
			@now.control.set(t, r)
			@throttle = t
			@rudder = r

	draw: () =>
	  
		@ctx.clearRect 0, 0, @canvas.width, @canvas.height
		
		for touch in touches

			if touch.identifier is throttleController?.identifier
				txt = 'throttle : '
			else if touch.identifier is rudderController?.identifier
				txt = 'rudder : '
			else
				txt = 'unknown : '

			ctx.beginPath()
			ctx.fillStyle = 'white'
			ctx.fillText txt + ' x:' + touch.clientX + ' y:' + touch.clientY, touch.clientX+30, touch.clientY-30 

			ctx.beginPath()
			ctx.strokeStyle = 'cyan'
			ctx.lineWidth = 6
			ctx.arc touch.clientX, touch.clientY, 40, 0, Math.PI*2, true 
			ctx.stroke()

		ctx

	onTouchStart: (e) =>
		touches = e.touches
		for touch in e.changedTouches
			if !@throttleController && touch.clientX < (canvas.width / 2)
				@throttleController = touch
				@throttleController.originY = @throttleController.clientY

			if !@rudderController && touch.clientX > (canvas.width / 2)
				@rudderController = touch
				@rudderController.originX = @rudderController.clientX
		e


	onTouchEnd: (e) =>
		touches = e.touches
		for touch in e.changedTouches
			if throttleController?.identifier is touch.identifier
				throttleController = null

			if rudderController?.identifier is touch.identifier
				rudderController = null
		e

	onTouchMove: (e) =>
		e.preventDefault()
		touches = e.touches

		e


	###
	 *	Touch event (e) properties : 
	 *	e.touches: 			Array of touch objects for every finger currently touching the screen
	 *	e.targetTouches: 	Array of touch objects for every finger touching the screen that
	 *						originally touched down on the DOM object the transmitted the event.
	 *	e.changedTouches	Array of touch objects for touches that are changed for this event. 					
	 *						I'm not sure if this would ever be a list of more than one, but would 
	 *						be bad to assume. 
	 *
	 *	Touch objects : 
	 *
	 *	identifier: An identifying number, unique to each touch event
	 *	target: DOM object that broadcast the event
	 *	clientX: X coordinate of touch relative to the viewport (excludes scroll offset)
	 *	clientY: Y coordinate of touch relative to the viewport (excludes scroll offset)
	 *	screenX: Relative to the screen
	 *	screenY: Relative to the screen
	 *	pageX: Relative to the full page (includes scrolling)
	 *	pageY: Relative to the full page (includes scrolling)
	###	