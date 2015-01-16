/*
 *	Configuration
 */
 
var dummyDevices = false;
var runDirectory = '/home/pi/greenhouse';

/*
 *  Database
 * */

var Nedb = require('nedb')
var temperatureDB = new Nedb({ filename: runDirectory+'/temperature.db', autoload: true });
var lightswitchlogDB = new Nedb({ filename: '/home/pi/greenhouse/ligthswitchlog.db', autoload: true });
	
var express = require('express')
  , routes = require('./routes')({tempDB:temperatureDB,lightSwitchLogDB:lightswitchlogDB})
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var app = express();

// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/partials/:name', function (req, res)
 { var name = req.params.name;
   res.render('partials/' + name);
});
app.get('/lightinfo/:date', routes.lightinfo);
app.get('/lightswitchlog', routes.lightswitchlog);
app.get('/temperature/start/:start/end/:end', routes.temperature)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);

EventEmitter = require('events').EventEmitter; 
connectionEvent = new EventEmitter();

ioEvent = new EventEmitter();

var ooswitch = require('ooswitch');
var lightSwitch = new ooswitch('lightSwitch', '21', ioEvent,'sudo python /home/pi/greenhouse/python/switch.py',lightswitchlogDB);
var lightschedule = require('lightschedule');

var scheduler = new lightschedule.scheduler(lightSwitch,ioEvent)
scheduler.checkStatus();

var sensor = require('sensor');
var  temperatureSensor = new sensor('python /home/pi/greenhouse/python/termometer.py',temperatureDB);
temperatureSensor.enable();

io.on('connection', function (socket) {
	lightSwitch.connectionEventHandler(lightSwitch,{ioSocket:socket});
	scheduler.connectionEventHandler(scheduler,{ioSocket:socket});
	
	console.log("new connection");
	
	socket.on('lightSwitch',function(data){
		lightSwitch.switchEventHandler(lightSwitch,data,socket);
	});	
	socket.on('SchedulerStatusChanged',function(data){
		console.log("------------------");
		console.log("scheduler status changed");
		console.log("toggle schedulera: "+data.schedulerState);
		console.log("------------------");
		scheduler.switchEventHandler(scheduler,data,socket);
	});

	socket.on('disconnect',function(){
	//	scheduler.disconnectEventHandler(scheduler,{ioSocket:socket})
	});
});

