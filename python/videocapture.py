#!/usr/bin/python
import os
import sys
import random
import string
from subprocess import call

imgDir = (sys.argv[1])

randomName = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(12))
randomName += '.jpg'
call("fswebcam -r 1280x720 "+imgDir+randomName, shell=True)
print randomName;
