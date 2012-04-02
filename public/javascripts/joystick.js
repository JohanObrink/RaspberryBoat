(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module('rbb');

  rbb.Joystick = (function() {

    function _Class(canvas, now) {
      this.canvas = canvas;
      this.now = now;
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.draw = __bind(this.draw, this);
      this.send = __bind(this.send, this);
      this.resetCanvas = __bind(this.resetCanvas, this);
      this.resetCanvas();
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.throttleController = null;
      this.rudderController = null;
      this.touches = [];
      this.throttle = 0;
      this.rudder = 0;
      this.canvas.addEventListener('touchstart', this.onTouchStart, false);
      this.canvas.addEventListener('touchmove', this.onTouchMove, false);
      this.canvas.addEventListener('touchend', this.onTouchEnd, false);
      window.onorientationchange = this.resetCanvas;
      window.onresize = this.resetCanvas;
      setInterval(this.draw, 1000 / 35);
      setInterval(this.send, 1000 / 5);
    }

    _Class.prototype.resetCanvas = function(e) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      window.scrollTo(0, 0);
      return e;
    };

    _Class.prototype.send = function() {
      var r, t;
      t = 0;
      r = 0;
      if (!!this.throttleController) {
        t = this.throttleController.clientY - this.throttleController.originY;
      }
      if (!!this.rudderController) {
        r = this.rudderController.clientX - this.rudderController.originX;
      }
      if (t === !this.throttle || r === !this.rudder) {
        this.now.control.set(t, r);
        this.throttle = t;
        return this.rudder = r;
      }
    };

    _Class.prototype.draw = function() {
      var touch, txt, _i, _len;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (_i = 0, _len = touches.length; _i < _len; _i++) {
        touch = touches[_i];
        if (touch.identifier === (typeof throttleController !== "undefined" && throttleController !== null ? throttleController.identifier : void 0)) {
          txt = 'throttle : ';
        } else if (touch.identifier === (typeof rudderController !== "undefined" && rudderController !== null ? rudderController.identifier : void 0)) {
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
        ctx.stroke();
      }
      return ctx;
    };

    _Class.prototype.onTouchStart = function(e) {
      var touch, touches, _i, _len, _ref;
      touches = e.touches;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (!this.throttleController && touch.clientX < (canvas.width / 2)) {
          this.throttleController = touch;
          this.throttleController.originY = this.throttleController.clientY;
        }
        if (!this.rudderController && touch.clientX > (canvas.width / 2)) {
          this.rudderController = touch;
          this.rudderController.originX = this.rudderController.clientX;
        }
      }
      return e;
    };

    _Class.prototype.onTouchEnd = function(e) {
      var rudderController, throttleController, touch, touches, _i, _len, _ref;
      touches = e.touches;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if ((typeof throttleController !== "undefined" && throttleController !== null ? throttleController.identifier : void 0) === touch.identifier) {
          throttleController = null;
        }
        if ((typeof rudderController !== "undefined" && rudderController !== null ? rudderController.identifier : void 0) === touch.identifier) {
          rudderController = null;
        }
      }
      return e;
    };

    _Class.prototype.onTouchMove = function(e) {
      var touches;
      e.preventDefault();
      touches = e.touches;
      return e;
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

    return _Class;

  })();

}).call(this);
