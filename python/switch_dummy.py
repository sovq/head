#!/usr/bin/python
import sys

argumentPort = sys.argv[1]
portNumber = int(argumentPort)
argumentState = sys.argv[2]

if(argumentState=="on"):
	print "on"
elif(argumentState=="off"):
	print "off"
elif(argumentState=="status"):
	print "on"
	




