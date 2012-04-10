(function() {
  var canvas, container, ctx, draw, init, mouseX, mouseY, onMouseMove, onTouchEnd, onTouchMove, onTouchStart, resetCanvas, rudderController, setupCanvas, throttleController, touchable, touches;

  canvas = null;

  ctx = null;

  container = null;

  mouseX = 0;

  mouseY = 0;

  throttleController = null;

  rudderController = null;

  touchable = document.createTouch != null;

  touches = [];

  resetCanvas = function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return window.scrollTo(0, 0);
  };

  init = function() {
    setupCanvas();
    if (touchable) {
      canvas.addEventListener('touchstart', onTouchStart, false);
      canvas.addEventListener('touchmove', onTouchMove, false);
      canvas.addEventListener('touchend', onTouchEnd, false);
      window.onorientationchange = resetCanvas;
      window.onresize = resetCanvas;
    } else {
      canvas.addEventListener('mousemove', onMouseMove, false);
    }
    return setInterval(draw, 1000 / 35);
  };

  draw = function() {
    var touch, txt, _i, _len, _results;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (touchable) {
      _results = [];
      for (_i = 0, _len = touches.length; _i < _len; _i++) {
        touch = touches[_i];
        if (touch.identifier === throttleController) {
          txt = 'throttle : ';
        } else if (touch.identifier === rudderController) {
          txt = 'rudder : ';
        } else {
          txt = 'unknown : ';
        }
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillText(txt + ' x:' + touch.clientX + ' y:' + touch.clientY, touch.clientX + 30, touch.clientY - 30);
        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 6;
        ctx.arc(touch.clientX, touch.clientY, 40, 0, Math.PI * 2, true);
        _results.push(ctx.stroke());
      }
      return _results;
    } else {
      ctx.fillStyle = 'white';
      return ctx.fillText('mouse : ' + mouseX + ', ' + mouseY, mouseX, mouseY);
    }
  };

  /*
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
  */

  onTouchStart = function(e) {
    var touch, _i, _len, _ref;
    touches = e.touches;
    _ref = e.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      if (!throttleController && touch.clientX < (canvas.width / 2)) {
        throttleController = touch.identifier;
      }
      if (!rudderController && touch.clientX > (canvas.width / 2)) {
        rudderController = touch.identifier;
      }
    }
    return e;
  };

  onTouchEnd = function(e) {
    var touch, _i, _len, _ref;
    touches = e.touches;
    _ref = e.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      if (throttleController === touch.identifier) throttleController = null;
      if (rudderController === touch.identifier) rudderController = null;
    }
    return e;
  };

  onTouchMove = function(e) {
    e.preventDefault();
    return touches = e.touches;
  };

  onMouseMove = function(event) {
    mouseX = event.offsetX;
    return mouseY = event.offsetY;
  };

  setupCanvas = function() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    container = document.createElement('div');
    container.className = 'container';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(container);
    container.appendChild(canvas);
    ctx.strokeStyle = '#ffffff';
    return ctx.lineWidth = 2;
  };

  init();

}).call(this);