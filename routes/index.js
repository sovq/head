
/*
 * GET home page.
 */

function routes(params){
	var tempDB = params.sensorData;
	var lightSwitchLogDB = params.switchlog;
	var sunsetDB = params.sunset;
	var dateFormat = require('dateformat');
	var tempUtils = require('./sensordata');

	this.index = function(req, res){
		res.render('index', { title: 'GreenHouse' });
	};
  
	this.lightinfo = function(req,res){
		var date = req.params.date;
		sun = sunsetDB;
		
		var lightingList = [];

		reqDate = new Date(date);
		reqDate.setHours(00)
		reqDate = dateFormat(reqDate,"isoDateTime");

		sun.find({date: reqDate}, function (err, docs) {
			for(var i=0;i<docs.length;i++){
				var row = docs[i];
				var sunLight = {'date': row.date, 'sunrise': row.sunrise, 'sunset': row.sunset }
				lightingList.push(sunLight);
			}
			
			var json = JSON.stringify(lightingList); 
			console.log(json);
			res.end(json);
		});
	};
	
	
	this.sensordata = function(req,res){
		var results = [];
		var start = req.params.start;
		var end = req.params.end;
		var sensorName = req.params.sensor;
		
		startDate = new Date();
		endDate = new Date();
		startDate.setTime(start);
		endDate.setTime(end);
		
		startDateString = dateFormat(startDate, "yyyy-mm-dd, HH:MM:ss");
		endDateString = dateFormat(endDate, "yyyy-mm-dd, HH:MM:ss");
		
		//console.log(startDateString);
		//console.log(endDateString);
		
		
		
		tempDB.find({date:{$gte:startDateString,$lte:endDateString},sensor:sensorName}).sort({date:1}).exec(function(err,docs){
			var meanArray = tempUtils.createMeanArray(start,end,docs)
			for(var i=0;i<docs.length;i++){
				var doc = docs[i];
				for(var j=0;j<50;j++){
			
					var meanArrayElement = meanArray[j];
					var meanArrayNext = meanArray[j+1];
					if (doc.date>=meanArrayElement.start && doc.date<=meanArrayNext.start){
						meanArrayElement.mean.push(doc.value);
					}
				}
				//console.log(doc.date)
			}
			meanArray.pop();
			console.log("number of meanArray elements"+meanArray.length)
			resultArray = tempUtils.buildResponseJSON(meanArray,sensorName);
			
			//console.log(resultArray);
			var json = JSON.stringify(resultArray); 
			res.end(json);
		});
	}
	
	this.lightswitchlog = function(req,res){
		var startDate = req.params.date;
		var direction = req.params.direction;
		
		var query = null;
		console.log("start date: "+startDate);
		if(direction=='up'){
			query = {date:{$gte:startDate}}
		}else if(direction=='down'){
			query = {date:{$lte:startDate}}
		}
		
		var resultsArray = [];
		lightSwitchLogDB.find(query).sort({date:-1}).limit(10).exec(function(err,docs){
			for(i=0;i<docs.length;i++){
				var doc = docs[i];
				resultsArray.push({
					date: doc.date,
					toggle: doc.toggle,
					origin: doc.origin
				});
			}
			var json = JSON.stringify(resultsArray); 
			//console.log(json);
			res.end(json);
		});	
	}
	
	return this;
}
module.exports = routes;
