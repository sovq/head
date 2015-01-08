
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'GreenHouse' });
};
exports.lightinfo = function(req,res){
	var date = req.params.date;
	var Nedb = require('nedb')
    sun = new Nedb({ filename: '/home/pi/greenhouse/sunset.db', autoload: true });
	var dateFormat = require('dateformat');

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
exports.temperature = function(req,res){
	var start = req.params.start;
	var end = req.params.end;
	res.end(start+'...'+end);
}
