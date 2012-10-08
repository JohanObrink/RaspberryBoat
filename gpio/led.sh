#!/bin/bash

PID=`ps auxww | egrep "python /home/pi/src/gpio/led.py $1" | grep -v egrep | awk '{print \$2}'`

if [ $PID > 0 ]; then
  kill -9 $PID
fi

python /home/pi/src/gpio/led.py $1 $2 &
