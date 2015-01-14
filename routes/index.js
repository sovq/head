
/*
 * GET home page.
 */

function routes(params){
	var tempDB = params.tempDB;
	var dateFormat = require('dateformat');
	var tempUtils = require('./temperature');

	this.index = function(req, res){
		res.render('index', { title: 'GreenHouse' });
	};
  
	this.lightinfo = function(req,res){
		var date = req.params.date;
		var Nedb = require('nedb')
		sun = new Nedb({ filename: '/home/pi/greenhouse/sunset.db', autoload: true });
		
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
	
	
	this.temperature = function(req,res){
		var results = [];
		var start = req.params.start;
		var end = req.params.end;
		
		startDate = new Date();
		endDate = new Date();
		startDate.setTime(start);
		endDate.setTime(end);
		
		startDateString = dateFormat(startDate, "yyyy-mm-dd, HH:MM:ss");
		endDateString = dateFormat(endDate, "yyyy-mm-dd, HH:MM:ss");
		
		console.log(startDateString);
		console.log(endDateString);
		
		
		
		tempDB.find({date:{$gte:startDateString,$lte:endDateString}}).sort({date:1}).exec(function(err,docs){
			var meanArray = tempUtils.createMeanArray(start,end,docs)
			for(var i=0;i<docs.length;i++){
				var doc = docs[i];
				for(var j=0;j<50;j++){
					var meanArrayElement = meanArray[j];
					var meanArrayNext = meanArray[j+1];
					if (doc.date>=meanArrayElement.start && doc.date<=meanArrayNext.start){
						meanArrayElement.mean.push(doc.temperature);
					}
				}
				console.log(doc.date)
			}
			meanArray.pop();
			console.log("number of meanArray elements"+meanArray.length)
			resultArray = tempUtils.buildResponseJSON(meanArray);
			
			//console.log(resultArray);
			var json = JSON.stringify(resultArray); 
			res.end(json);
		});
	}
	return this;
}
module.exports = routes;
