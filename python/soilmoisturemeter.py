#!/usr/bin/python
import sys
import RPi.GPIO as GPIO


argumentPort = sys.argv[1]
portNumber = int(argumentPort)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(portNumber, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
print GPIO.input(portNumber)
	
