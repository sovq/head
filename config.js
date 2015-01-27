// set this.rundir in line 7
// set 'dummy:true' for all devices that are not physically available

function config(){

	this.rundir = '/home/pi/greenhouse/'; 
	
	if(this.rundir==null){
		console.log("Set this.rundir in config.js");
		process.exit();
	}
	
	this.dummyPrefix = 'dummy_'			  



// list all switching devices

	this.ssrSwitches = {
		
		velve : {
			name: 'velve',
			////////////////////////////////////////////////////////
			dummy: false,  // set to true if no device is connected
			////////////////////////////////////////////////////////
			superUserExec: true,
			dir: 'python/',
			path: 'switch.py',
			gpio: '20', 
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix
			
		},
		lighting : {
			name: 'lighting',
			////////////////////////////////////////////////////////
			dummy: false,  // set to true if no device is connected
			////////////////////////////////////////////////////////
			superUserExec: true,
			dir: 'python/',
			path: 'switch.py',
			gpio: '21',
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix
		}
	}
	
// list all sensors
	this.sensors = {
		termometer1:{
			name: 'AIR',
			///////////////////////////////////////////////////////////
			dummy: false, // set to true if no device is connected
			///////////////////////////////////////////////////////////
			dir: 'python/',
			path: 'termometer.py',
			interface: 'none',
			superUserExec: false,
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix
		},
		soilmoisturemeter:{
			name: 'moisture',
			///////////////////////////////////////////////////////////////
			dummy: false, // set to true if no device is connected
			//////////////////////////////////////////////////////////////
			dir: 'python/',
			path: 'soilmoisturemeter.py',
			interface: 'spi',
			channel: 0,
			superUserExec: false,
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix
		}
	}
	return this;
}
module.exports = config;
