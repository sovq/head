// set this.rundir in line 6
// set 'dummy:true' for all devices that are not physically available

function config(){

	this.rundir = null; 
	
	if(this.rundir==null){
		console.log("Set this.rundir in config.js");
		process.exit();
	}
	
	this.dummyPrefix = 'dummy_'			  

	this.buildExecString=function(config){
		var execString = '';
		if(config.superUserExec){
			execString += 'sudo ';
		}
		execString += 'python '
		execString += config.rundir
		execString += config.dir
		if(config.dummy){
			execString += config.dummyPrefix;
		}
		execString += config.path;
		if(config.interface=='spi'){
			execString += ' '
			execString += config.channel;
		}else if(config.interface=='gpio'){
			execString += ' '
			execString += config.gpio;		
		}
		return execString;
	}

// list all switching devices

	this.ssrSwitches = {
		
		velve : {
			name: 'velve',
			////////////////////////////////////////////////////////
			dummy: true,  // set to true if no device is connected
			////////////////////////////////////////////////////////
			superUserExec: true,
			dir: 'python/',
			path: 'switch.py',
			interface: 'gpio',
			gpio: '20', 
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix,
			buildExecString: this.buildExecString
			
		},
		lighting : {
			name: 'lighting',
			////////////////////////////////////////////////////////
			dummy: true,  // set to true if no device is connected
			////////////////////////////////////////////////////////
			superUserExec: true,
			dir: 'python/',
			path: 'switch.py',
			interface: 'gpio',
			gpio: '21',
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix,
			buildExecString: this.buildExecString
		}
	}
	
// list all sensors
	this.sensors = {
		termometer1:{
			name: 'AIR',
			///////////////////////////////////////////////////////////
			dummy: true, // set to true if no device is connected
			///////////////////////////////////////////////////////////
			dir: 'python/',
			path: 'termometer.py',
			interface: 'none',
			superUserExec: false,
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix,
			buildExecString: this.buildExecString
		},
		soilmoisturemeter:{
			name: 'moisture',
			///////////////////////////////////////////////////////////////
			dummy: true, // set to true if no device is connected
			//////////////////////////////////////////////////////////////
			dir: 'python/',
			path: 'soilmoisturemeter.py',
			interface: 'spi',
			channel: 0,
			superUserExec: false,
			rundir: this.rundir,
			dummyPrefix: this.dummyPrefix,
			buildExecString: this.buildExecString
		}
	}
	return this;
}
module.exports = config;
