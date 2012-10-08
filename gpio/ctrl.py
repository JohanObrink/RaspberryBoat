import sys
import subprocess
from time import sleep
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

while 1:
	reboot = GPIO.input(4)
	halt = GPIO.input(17)

	if halt:
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '1', 'fast'])
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '2', 'fast'])
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '3', 'fast'])
		subprocess.Popen(['halt'])
		break	
	if reboot:
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '1', 'blink'])
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '2', 'blink'])
		subprocess.Popen(['/home/pi/src/gpio/led.sh', '3', 'blink'])
		subprocess.Popen(['reboot'])
		break
	sleep(0.2)
