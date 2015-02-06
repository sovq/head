var config = new require('./config')();
var Nedb = require('nedb');
var db = {
	sensorData: new Nedb({ filename: config.rundir+'db/sensorlog.db', autoload: true }),
	switchlog: new Nedb({ filename: config.rundir+'db/switchlog.db', autoload: true }),
	sunset: new Nedb({ filename: config.rundir+'db/sunset.db', autoload: true }),	
	config : new Nedb({ filename: config.rundir+'db/config.db', autoload: true })	
}
var ssrSwitches = config.ssrSwitches;
var sensors = config.sensors;

var EventEmitter = require('events').EventEmitter; 
var Ssr = require('ssrswitch');
var LightSchedule = require('lightschedule');
var Sensor = require('sensor');
var WateringController = require('wateringcontroller');

var lightSwitch = new Ssr(ssrSwitches.lighting,db.switchlog);
var velve = new Ssr(ssrSwitches.velve,db.switchlog);
var wateringController = new WateringController({	name:'watering',
													ssrSwitch:velve,
													configdb:db.config,
													switchlog:db.switchlog,
												})


var lightScheduler = new LightSchedule.Scheduler(lightSwitch,db.config, db.sunset);

var temperatureSensor = new Sensor(sensors.termometer1,db.sensorData,120000);
var moistureSensor = new Sensor(sensors.soilmoisturemeter,db.sensorData,7200000);

moistureSensor.addListener(moistureSensor.name,function(data){wateringController.sensorEventHandler(data)})



var express = require('express')
  , routes = require('./routes')(db,wateringController)
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
app.get('/switchlog/:switchname/date/:date/direction/:direction', routes.switchlog);
app.get('/sensordata/:sensor/start/:start/end/:end', routes.sensordata)
app.get('/wateringcontrol/:action/:direction',routes.wateringcontrol)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



var io = require('socket.io')(server);

io.on('connection', function (socket) {
	
	socket.on(lightSwitch.name,function(data){
		lightSwitch.switchEventHandler(data);
	});
	
	socket.on(lightScheduler.name,function(data){
		lightScheduler.switchEventHandler(data)
	});
	
	lightSwitch.addListener(lightSwitch.name,function(data){
		socket.emit(lightSwitch.name,data)
	});
	wateringController.addListener(wateringController.name,function(data){
		socket.emit(wateringController.name,data)
	});
	
	lightScheduler.addListener(lightScheduler.name,function(data){
		socket.emit(lightScheduler.name,data)
	});
	

});

