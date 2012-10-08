import sys
from time import sleep
import RPi.GPIO as GPIO

broadcom = [17, 18, 21, 22, 23, 24, 25, 4]

pin = broadcom[int(sys.argv[1])]
mode = sys.argv[2]

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

if mode == 'on':
  while 1:
    GPIO.output(pin, False)
    sleep(10)
elif mode == 'off':
  GPIO.output(pin, True)
elif mode == 'blink' or mode == 'fast':
  if mode == 'blink':
    pause = 0.25
  else:
    pause = 0.05

  while 1:
    GPIO.output(pin, True)
    sleep(pause)
    GPIO.output(pin, False)
    sleep(pause)
