function getChartData(scope,now,span,http){
	//'weeks','days','hours','minutes',
	var dateSpan = []
	now = Number(now);
	switch(span){
		case 0:
			dateSpan = [now-1500000,now+1500000]
		case 1:
			dateSpan = [now-21600000,now+21600000]
		case 2:
			dateSpan = [now-129600000,now+129600000]
		case 3:
			dateSpan = [now-604800000,now+604800000]
		
	}
	
	http.get('/temperature/start/'+dateSpan[0]+'/end/'+dateSpan[1]).
			success(function(data, status, headers, config) {
				  console.log(data);		  
			  }).
			  error(function(data, status, headers, config) {
				  alert('zjebanstwo');
				  
	});
}

function setTimeSpan(scope,spans,span,http){
	scope.timeSpan = spans[span];
	var now = new Date();
	getChartData(scope,now,span,http);
	
}

GreenHouseApp.controller('LogsDisplayController', ['$scope','$http',function($scope,$http){
	$scope.config = {
		title: 'Temperature',
		tooltips: true,
		labels: false,
		xAxisMaxTicks: 6,
		mouseover: function() {},
		mouseout: function() {},
		click: function() {},
		legend: {
		  display: true,
		  //could be 'left, right'
		  position: 'right'
		}
	};
	
	var spans = ['weeks','days','hours','minutes'];
	var span = 2;
	$scope.timeSpan = spans[span];
	$scope.DisplayZoomOut = true;
	$scope.DisplayZoomIn = true;

	$scope.zoomChartIn = function(){
		$scope.DisplayZoomOut = true;
		
		span += 1;
		$scope.timeSpan = spans[span];
		if(span == spans.length-1){
			$scope.DisplayZoomIn = false;
		}

		setTimeSpan($scope,spans,span,$http);
	}
	
	$scope.zoomChartOut = function(){		
		$scope.DisplayZoomIn = true;
		
		span -= 1;
		if(span==0){				
			$scope.DisplayZoomOut = false;
		}
		
		setTimeSpan($scope,spans,span,$http);
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$scope.data = { series: [ 'temperature AIR' ],
  data: 
   [ { x: '14:22:11', y: [12] },
     { x: '14:22:21', y: [12] },
     { x: '14:22:32', y: [12] },
     { x: '14:22:42', y: [12] },
     { x: '14:22:52', y: [13] },
     { x: '14:23:02', y: [14] },
     { x: '14:23:12', y: [14] },
     { x: '14:23:22', y: [14] },
     { x: '14:23:32', y: [13] },
     { x: '14:23:43', y: [12] },
     { x: '14:23:53', y: [11] },
     { x: '14:24:03', y: [10] },
     { x: '14:24:13', y: [9] },
     { x: '14:24:23', y: [9] },
     { x: '14:24:33', y: [9] },
     { x: '14:24:43', y: [8] },
     { x: '14:24:54', y: [8] },
     { x: '14:25:04', y: [8] },
     { x: '14:25:14', y: [9] },
     { x: '14:25:24', y: [9] },
     { x: '14:25:34', y: [9] },
     { x: '14:25:44', y: [9] },
     { x: '14:25:54', y: [8] },
     { x: '14:26:05', y: [9] },
     { x: '14:26:15', y: [10] },
     { x: '14:26:25', y: [11] },
     { x: '14:26:35', y: [12] },
     { x: '14:26:45', y: [12] },
     { x: '14:26:55', y: [13] },
     { x: '14:27:05', y: [13] },
     { x: '14:27:15', y: [12] },
     { x: '14:27:26', y: [12] },
     { x: '14:27:36', y: [12] },
     { x: '14:27:46', y: [12] },
     { x: '14:27:56', y: [12] },
     { x: '14:28:06', y: [12] },
     { x: '14:28:16', y: [12] },
     { x: '14:28:26', y: [12] },
     { x: '14:28:37', y: [12] },
     { x: '14:28:47', y: [12] } ] }	
}]);
