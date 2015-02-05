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
	
	$scope.switchName = 'velve';
	$scope.displayDurationMinus = true;
	$scope.displyDurationPlus = true;
	$scope.displayDrynessMinus = true;
	$scope.displeyDrynessPlus = true;
	
	function clone(obj) {
				if (null == obj || "object" != typeof obj) return obj;
				if (obj instanceof Date) {
					var copy = new Date();
					copy.setTime(obj.getTime());
					return copy;
				}
				if (obj instanceof Array) {
					var copy = [];
					for (var i = 0, len = obj.length; i < len; i++) {
						copy[i] = clone(obj[i]);
					}
					return copy;
				}
				if (obj instanceof Object) {
					var copy = {};
					for (var attr in obj) {
						if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
					}
					return copy;
				}

				throw new Error("Unable to copy obj! Its type isn't supported.");
			}
	
	function getWateringData(action,direction){

		$http.get('/wateringcontrol/'+action+'/'+direction).
			success(function(data, status, headers, config) {
				$scope.drynessLevel = data.dryness
				$scope.wateringDuration = data.duration/1000
				if(action=='DrynessLevel'&&$scope.data!=null){
					var myData = clone($scope.data);
					for(i=0;i<myData.data.length;i++){
						myData.data[i].y[1]=data.dryness;
					}
					console.log(myData)
					$scope.data=myData;
				}
					
				
			}).
			error(function(data, status, headers, config) {
				alert('zjebanstwo');		  
		});
	}
	
	$scope.setDuration=function(direction){
		$scope.displayDurationMinus = true;
		$scope.displyDurationPlus = true;
		getWateringData('WateringDuration',direction)
	}
	
	$scope.setDryness=function(direction){
		$scope.displayDrynessMinus = true;
		$scope.displeyDrynessPlus = true;
		getWateringData('DrynessLevel',direction)
	}
	
	getWateringData('DrynessLevel','status')
		
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
					  data.series.push("dry")
					  for(i=0;i<data.data.length;i++){
							data.data[i].y.push($scope.drynessLevel)
					  }
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
