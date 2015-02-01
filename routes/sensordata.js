var dateFormat =  require("dateformat");

module.exports.buildResponseJSON = function(data,sensorName){
	var results = [];
	var sensorName = sensorName;
	for(i = 0; i<data.length;i++){
		var temperature = "no_data";
		var now = new Date();
		now = dateFormat(now, "yyyy-mm-dd, HH:MM:ss")
		
		
		var item = data[i];
		var measurements = item.mean;
		var date = item.start
		if(date>now && measurements.length==0){
			temperature = "future";
		}
		else if(measurements.length!=0){
			var sum = 0;
			for(j=0;j<measurements.length;j++){
					sum +=Number(measurements[j]);
			}
			temperature = sum/measurements.length;
			temperature=Math.round(temperature * 100) / 100
		}
		results.push({x:date.substr(date.length-8),y:[temperature]})
	}
	
	return {series:[sensorName],data: results}
	
}

module.exports.createMeanArray = function(paramStart,paramEnd){
	var start = Number(paramStart);
	var end = Number(paramEnd)
	var labelledTable = [];
	var difference = end - start;
	var interval = difference/50;
	
	
	var myDate = new Date();
	
	for(i=0;i<=50;i++){
		myDate.setTime(Math.round(start+(i*interval)))
		labelledTable.push({start:dateFormat(myDate, "yyyy-mm-dd, HH:MM:ss"),mean:[]})
	}	
	return labelledTable
}



