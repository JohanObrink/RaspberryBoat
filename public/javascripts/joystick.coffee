canvas = null
ctx = null
container = null

mouseX = 0
mouseY = 0

throttleController = null
rudderController = null

# is this running in a touch capable environment?
touchable = document.createTouch?
touches = [] # array of touch vectors


resetCanvas = (e) ->
	# resize the canvas - but remember - this clears the canvas too. 
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	
	#make sure we scroll to the top left. 
	window.scrollTo 0,0


init = () ->
	setupCanvas()

	if touchable
		canvas.addEventListener 'touchstart', onTouchStart, false
		canvas.addEventListener 'touchmove', onTouchMove, false
		canvas.addEventListener 'touchend', onTouchEnd, false
		window.onorientationchange = resetCanvas
		window.onresize = resetCanvas 
	else	
		canvas.addEventListener 'mousemove', onMouseMove, false

	setInterval draw, (1000/35) 

draw = () ->
  
	ctx.clearRect 0, 0, canvas.width, canvas.height 
	
	if touchable
	
		for touch in touches

			ctx.beginPath()
			ctx.fillStyle = 'white'
			ctx.fillText 'touch id : ' + touch.identifier + ' x:' + touch.clientX + ' y:' + touch.clientY, touch.clientX+30, touch.clientY-30 

			ctx.beginPath()
			ctx.strokeStyle = 'cyan'
			ctx.lineWidth = 6
			ctx.arc touch.clientX, touch.clientY, 40, 0, Math.PI*2, true 
			ctx.stroke()
	else
		
		ctx.fillStyle = 'white' 
		ctx.fillText 'mouse : ' + mouseX + ', ' + mouseY, mouseX, mouseY
		
	#c.fillText("hello", 0,0); 

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

onTouchStart = (e) ->
	touches = e.touches
	for touch in changedTouches
		if !throttleController && touch.clientX < canvas.width / 2
			throttleController = touch.identifier

		if !rudderController && touch.clientX > canvas.width / 2
			rudderController = touch.identifier
 
onTouchMove = (e) ->
	# Prevent the browser from doing its default thing (scroll, zoom)
	e.preventDefault()
	touches = e.touches 

 
onTouchEnd = (e) ->
   	touches = e.touches


onMouseMove = (event) ->
	mouseX = event.offsetX
	mouseY = event.offsetY


setupCanvas = () ->	
	canvas = document.createElement 'canvas'
	ctx = canvas.getContext '2d'
	container = document.createElement 'div'
	container.className = 'container'

	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight; 
	document.body.appendChild container
	container.appendChild canvas
	
	ctx.strokeStyle = '#ffffff'
	ctx.lineWidth = 2

init()