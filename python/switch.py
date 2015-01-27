#!/usr/bin/python
import sys
import RPi.GPIO as GPIO


argumentPort = sys.argv[1]
portNumber = int(argumentPort)
argumentState = sys.argv[2]

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(portNumber, GPIO.OUT)

if(argumentState=="on"):
	gpioState = GPIO.HIGH
	GPIO.output(portNumber, gpioState)
	print "on"
elif(argumentState=="off"):
	gpioState = GPIO.LOW
	GPIO.output(portNumber, gpioState)
	print "off"
elif(argumentState=="status"):
	if(GPIO.input(portNumber)==0):
		print "off"
	else:
		print "on"
	




