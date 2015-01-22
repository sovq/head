#!/usr/bin/python
import sys
import spidev

# Open SPI bus
spi = spidev.SpiDev()
spi.open(0,0)

channel = int(sys.argv[1])

# Function to read SPI data from MCP3008 chip
def ReadChannel(channel):
   adc = spi.xfer2([1,(8+channel)<<4,0])
   data = ((adc[1]&3) << 8) + adc[2]
   return data
   
print ReadChannel(channel)


	
