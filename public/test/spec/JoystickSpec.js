describe("Joystick", function() {
  var joystick;
  var canvas;
  var now;

  beforeEach(function() {
    canvas = new FakeCanvas(768, 400);
    now = {
      throttle: 0,
      rudder: 0,
      isSet: false,
      controller: {
        set: function(t, r) {
          now.throttle = t;
          now.rudder = r;
          now.isSet = true;
        }
      }
    };
    joystick = new rbb.Joystick(canvas);
  });

  it("should add listeners to canvas correctly", function() {
    expect(canvas.listeners['touchstart'].length).toBe(1);
    expect(canvas.listeners['touchmove'].length).toBe(1);
    expect(canvas.listeners['touchend'].length).toBe(1);
  });

  describe("when a new touch is registered", function() {
    beforeEach(function() {
      joystick.stop();
      joystick.initialize(now);
    });

    afterEach(function() {
      joystick.stop();
    });

    describe("if it is on the left hand side", function() {
      var touch1;

      beforeEach(function() {
        touch1 = new FakeTouch(1, 10, 100, canvas);
        canvas.triggerEvent('touchstart', {
          changedTouches: [touch1],
          touches: [touch1]
        });
      });

      it("should start listening to throttle control", function() {
        expect(joystick.throttleController).toBe(touch1);
      });

      describe("and a throttle controller is allready registered", function() {
        var touch2;

        beforeEach(function() {
          touch2 = new FakeTouch(2, 20, 100, canvas);
          canvas.triggerEvent('touchstart', {
            changedTouches: [touch2],
            touches: [touch1, touch2]
          });
        });

        it("should still be listening to the original throttle controller", function() {
          expect(joystick.throttleController).toBe(touch1);
        });

      });

      describe("and an event occurs on the right side", function() {
        var touch2;

        beforeEach(function() {
          touch2 = new FakeTouch(2, 520, 100, canvas);
          canvas.triggerEvent('touchstart', {
            changedTouches: [touch2],
            touches: [touch1, touch2]
          });
        });

        it("should be listening to the original throttle controller", function() {
          expect(joystick.throttleController).toBe(touch1);
        });

        it("and to a rudder controller", function() {
          expect(joystick.rudderController).toBe(touch2);
        });

      });

      describe("and it moves 50px up", function() {

        beforeEach(function() {
          canvas.triggerEvent('touchmove', {
            preventDefault: function() {},
            touches: [new FakeTouch(1, 20, 50, canvas)]
          })
        });

        it("should send a throttle value of 1", function() {
          waitsFor(function() { return now.isSet }, "now was never called", 500);
          runs(function() {
            expect(now.throttle).toBe(1);
            expect(now.rudder).toBe(0);
          });
        });
        
      });

      describe("and it moves 50px down", function() {

        beforeEach(function() {
          canvas.triggerEvent('touchmove', {
            preventDefault: function() {},
            touches: [new FakeTouch(1, 20, 150, canvas)]
          })
        });

        it("should send a throttle value of -1", function() {
          waitsFor(function() { return now.isSet }, "now was never called", 500);
          runs(function() {
            expect(now.throttle).toBe(-1);
            expect(now.rudder).toBe(0);
          });
        });
        
      });
    });

    describe("if it is on the right hand side", function() {
      var touch1;

      beforeEach(function() {
        touch1 = new FakeTouch(1, 500, 100, canvas);
        canvas.triggerEvent('touchstart', {
          changedTouches: [touch1],
          touches: [touch1]
        });
      });

      it("should start listening to rudder control", function() {
        expect(joystick.rudderController).toBe(touch1);
      });

      describe("and a rudder controller is allready registered", function() {
        var touch2;

        beforeEach(function() {
          touch2 = new FakeTouch(2, 510, 100, canvas);
          canvas.triggerEvent('touchstart', {
            changedTouches: [touch2],
            touches: [touch1, touch2]
          });
        });

        it("should still be listening to the original rudder controller", function() {
          expect(joystick.rudderController).toBe(touch1);
        });

      });


      describe("and an event occurs on the left side", function() {
        var touch2;

        beforeEach(function() {
          touch2 = new FakeTouch(2, 20, 100, canvas);
          canvas.triggerEvent('touchstart', {
            changedTouches: [touch2],
            touches: [touch1, touch2]
          });
        });

        it("should be listening to the original rudder controller", function() {
          expect(joystick.rudderController).toBe(touch1);
        });

        it("and to a throttle controller", function() {
          expect(joystick.throttleController).toBe(touch2);
        });

      });

      describe("and it moves 50px left", function() {

        beforeEach(function() {
          canvas.triggerEvent('touchmove', {
            preventDefault: function() {},
            touches: [new FakeTouch(1, 450, 50, canvas)]
          })
        });

        it("should send a rudder value of -1", function() {
          waitsFor(function() { return now.isSet }, "now was never called", 500);
          runs(function() {
            expect(now.throttle).toBe(0);
            expect(now.rudder).toBe(-1);
          });
        });
        
      });

      describe("and it moves 50px right", function() {

        beforeEach(function() {
          canvas.triggerEvent('touchmove', {
            preventDefault: function() {},
            touches: [new FakeTouch(1, 550, 150, canvas)]
          })
        });

        it("should send a rudder value of 1", function() {
          waitsFor(function() { return now.isSet }, "now was never called", 500);
          runs(function() {
            expect(now.throttle).toBe(0);
            expect(now.rudder).toBe(1);
          });
        });
        
      });
    });
  });
});