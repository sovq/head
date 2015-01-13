var dateFormat =  require("dateformat");

module.exports.buildResponseJSON = function(data){
	var results = [];
	var sensorName = "Air";
	for(i = 0; i<data.length;i++){
		var temperature = 0;
		var item = data[i];
		var measurements = item.mean;
		var date = item.start
		if(measurements.length!=0){
			var sum = 0;
			for(j=0;j<measurements.length;j++){
					sum +=Number(measurements[j]);
			}
			temperature = sum/measurements.length
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
	var interval = difference/25;
	
	
	var myDate = new Date();
	
	for(i=0;i<=25;i++){
		myDate.setTime(Math.round(start+(i*interval)))
		labelledTable.push({start:dateFormat(myDate, "yyyy-mm-dd, HH:MM:ss"),mean:[]})
	}	
	return labelledTable
}



