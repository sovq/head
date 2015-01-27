var config = new require('./config')();
var Nedb = require('nedb');
db = {
	sensorData: new Nedb({ filename: this.rundir+'db/sensorlog.db', autoload: true }),
	switchlog: new Nedb({ filename: this.rundir+'db/switchlog.db', autoload: true }),
	sunset: new Nedb({ filename: this.rundir+'db/sunset.db', autoload: true }),	
	config : new Nedb({ filename: this.rundir+'db/config.db', autoload: true })	
}
var ssrSwitches = config.ssrSwitches;
var sensors = config.sensors;

var express = require('express')
  , routes = require('./routes')(db)
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
app.use(function(req, res) {
    res.status(400);
   res.render('404.jade', {title: '404: Nima strony'});
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/partials/:name', function (req, res){ 
	var name = req.params.name;
	res.render('partials/' + name);
});
app.get('/lightinfo/:date', routes.lightinfo);
app.get('/lightswitchlog/date/:date/direction/:direction', routes.lightswitchlog);
app.get('/temperature/start/:start/end/:end', routes.temperature)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);

EventEmitter = require('events').EventEmitter; 
connectionEvent = new EventEmitter();

ioEvent = new EventEmitter();

var ssr = require('ssrswitch');
var lightSwitch = new ssr(ssrSwitches.lighting,ioEvent,db.switchlog);

var lightschedule = require('lightschedule');

var scheduler = new lightschedule.scheduler(lightSwitch,ioEvent,db.config, db.sunset)
scheduler.checkStatus();

var sensor = require('sensor');
var  temperatureSensor = new sensor(sensors.termometer1,db.sensorData,30000);
temperatureSensor.enable();
var moistureSensor = new sensor(sensors.soilmoisturemeter,db.sensorData,1800000);
moistureSensor.enable();

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

