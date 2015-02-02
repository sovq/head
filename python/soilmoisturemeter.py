#!/usr/bin/python
import sys
import spidev


MAXHUMID_SENSOR = 1023 
MINHUMID_SENSOR = 260

# Open SPI bus
spi = spidev.SpiDev()
spi.open(0,0)

channel = int(sys.argv[1])

# Function to read SPI data from MCP3008 chip
def ReadChannel(channel):
   adc = spi.xfer2([1,(8+channel)<<4,0])
   data = ((adc[1]&3) << 8) + adc[2]
   return float(data)
      
def getMoisture(value):	
	if (value < MINHUMID_SENSOR):
		value = MINHUMID_SENSOR
		
	humidity = float((1 - (value - MINHUMID_SENSOR)/(MAXHUMID_SENSOR-MINHUMID_SENSOR)))
		
	return humidity
print getMoisture(ReadChannel(channel))


	
