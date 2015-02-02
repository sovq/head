GreenHouseApp.controller('WateringController', ['$scope','$http', function($scope,$http){
$scope.config = {
		title: 'Soil humidity',
		tooltips: true,
		labels: false,
		xAxisMaxTicks: 6,
		yAxisTickValues: [0.20,0.40,0.60,0.80],
		yAxisTickFormat: d3.format("%"),
		mouseover: function() {},
		mouseout: function() {},
		click: function() {},
		legend: {
		  display: true,
		  //could be 'left, right'
		  position: 'right'
		}
	};
	
		
	var ZOOM_STEP = 0.6;
	var TIME_STEP = 0.25;
	var FOUR_HOURS_IN_MS = 14400000;
	

	function getChartData(scope,dateSpan,http){
		if(scope.data!=null){
			scope.data.series=['loading'];
		}else{
			scope.data={series:['loading'],data:[{x:0,y:[0]}]}	
		}
		http.get('/sensordata/moisture/start/'+dateSpan[0].valueOf()+'/end/'+dateSpan[1].valueOf()).
				success(function(data, status, headers, config) {
					var limit = 0.2;
					  data.series.push("dry")
					  for(i=0;i<data.data.length;i++){
							data.data[i].y.push(limit)
					  }
					  console.log(data);
					  scope.data=data;		  
				  }).
				  error(function(data, status, headers, config) {
					  alert('zjebanstwo');		  
		});
	}

	function getTimeSpan(middle,duration){
		var middleMilliseconds = middle.valueOf()
		var start = new Date();
		var end = new Date();
		start.setTime(middleMilliseconds-duration)
		end.setTime(middleMilliseconds+duration);
		return [start,end];
	}


	function setStartEndInScope(scope,span){
		var start = span[0];
		var end = span[1];
		
		scope.startDate = start;
		scope.endDate = end;
	}
		
	
	
	$scope.DisplayZoomOut = true;
	$scope.DisplayZoomIn = true;
	$scope.chartCenter = new Date();
	$scope.chartDuration = FOUR_HOURS_IN_MS;
	
	$scope.lightSwitchLogData = [];

	
	setStartEndInScope($scope,getTimeSpan($scope.chartCenter,$scope.chartDuration));
	
	getChartData($scope,getTimeSpan($scope.chartCenter,$scope.chartDuration),$http);

	$scope.zoomChart = function(direction){
		if(direction=='in'){
			$scope.chartDuration *= (1-ZOOM_STEP);
		}else if(direction=='out'){
			$scope.chartDuration *= (1+ZOOM_STEP)
		}
		
		var timeSpan = getTimeSpan($scope.chartCenter,$scope.chartDuration);
		setStartEndInScope($scope,timeSpan);
		getChartData($scope,timeSpan,$http);
	}
	
	
	$scope.moveChart =function(direction){
		var chartCenterInMilliseconds = $scope.chartCenter.valueOf();
		var newCenterInMilliseconds = 0;
		if(direction=='left'){
			newCenterInMilliseconds = chartCenterInMilliseconds - ($scope.chartDuration*TIME_STEP);
		}else if(direction=='right'){
			newCenterInMilliseconds = chartCenterInMilliseconds + ($scope.chartDuration*TIME_STEP);
		}
		$scope.chartCenter.setTime(newCenterInMilliseconds)
		var timeSpan = getTimeSpan($scope.chartCenter,$scope.chartDuration);
		setStartEndInScope($scope,timeSpan);
		getChartData($scope,timeSpan,$http);
	}
	

	
}]);
