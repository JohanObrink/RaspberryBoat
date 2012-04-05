(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module('rbb');

  rbb.Joystick = (function() {

    function _Class(canvas, now) {
      this.canvas = canvas;
      this.now = now;
      this.draw = __bind(this.draw, this);
      this.send = __bind(this.send, this);
      this.resetCanvas = __bind(this.resetCanvas, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.onMouseMove = __bind(this.onMouseMove, this);
      this.resetCanvas();
      this.ctx = this.canvas.getContext('2d');
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

    _Class.prototype.onMouseMove = function(e) {
      this.touches = [e];
      return e;
    };

    _Class.prototype.onTouchStart = function(e) {
      var touch, _i, _len, _ref;
      this.msg = '';
      this.touches = e.touches;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        this.msg += "client: " + touch.clientX + ", " + touch.clientY + "			page:  " + touch.pageX + ", " + touch.pageY + "			screen:  " + touch.screenX + ", " + touch.screenY;
        if (!this.throttleController && touch.clientX < (this.canvas.width / 2)) {
          this.throttleController = touch;
          this.throttleController.originY = this.throttleController.clientY;
        }
        if (!this.rudderController && touch.clientX > (this.canvas.width / 2)) {
          this.rudderController = touch;
          this.rudderController.originX = this.rudderController.clientX;
        }
      }
      return e;
    };

    _Class.prototype.onTouchEnd = function(e) {
      var touch, _i, _len, _ref, _ref2, _ref3;
      this.touches = e.touches;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (((_ref2 = this.throttleController) != null ? _ref2.identifier : void 0) === touch.identifier) {
          this.throttleController = null;
        }
        if (((_ref3 = this.rudderController) != null ? _ref3.identifier : void 0) === touch.identifier) {
          this.rudderController = null;
        }
      }
      return e;
    };

    _Class.prototype.onTouchMove = function(e) {
      e.preventDefault();
      this.touches = e.touches;
      return e;
    };

    _Class.prototype.resetCanvas = function(e) {
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
      var touch, txt, x, y, _i, _len, _ref, _ref2, _ref3;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      _ref = this.touches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        x = touch.clientX - $(touch.target).position().left;
        y = touch.clientY - $(touch.target).position().top;
        if (touch.identifier === ((_ref2 = this.throttleController) != null ? _ref2.identifier : void 0)) {
          txt = 'throttle : ';
        } else if (touch.identifier === ((_ref3 = this.rudderController) != null ? _ref3.identifier : void 0)) {
          txt = 'rudder : ';
        } else {
          txt = 'unknown : ';
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(txt + ' x:' + x + ' y:' + y, x + 30, y - 30);
        this.ctx.fillText(this.msg, 10, 10);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'cyan';
        this.ctx.lineWidth = 6;
        this.ctx.arc(x, y, 40, 0, Math.PI * 2, true);
        this.ctx.stroke();
      }
      return this.ctx;
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
