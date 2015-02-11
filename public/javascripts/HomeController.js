GreenHouseApp.controller('HomeController',['$scope','$http',function($scope,$http) {
	$scope.temperatureGauge = {
		renderTo: 'gauge1',
		width: 200,
		height: 200,
		glow: true,
		units: '°C',
		title: 'Temperature'
	};
	
	$scope.humidityGauge = {
		renderTo: 'gauge2',
		width: 200,
		height: 200,
		glow: false,
		units: '%',
		title: 'Humidity'
		
	}
	$scope.temperature = 0;
	$scope.humidity = 0;
	$scope.img = ''
	
	var socket = io.connect();
	
	socket.on('captured',function(data){
		$scope.$apply(function(){
			$scope.img = 'img/'+data;
		})
	})
	
	socket.on('temperature',function(data){
		$scope.$apply(function(){
			$scope.temperature = data;
		})
	})
	
	socket.on('moisture',function(data){
		$scope.$apply(function(){
			$scope.humidity = data*100;
		})
	})
	socket.emit('gettemperature');
	socket.emit('getmoisture');
	socket.emit('getcaptured');
}]);

GreenHouseApp.directive('video',function() {
	
	return {
		scope:	{pic : '='},
		replace: 'true',
		template: '<img ng-src="{{pic}}" class="img-rounded">',

		link: function(scope, iElement, iAttrs){
			
		}

	}
});

GreenHouseApp.directive('gauge',function() {
	
	return {
		scope:	{configuration : '=',
				data : '='},  
		replace: 'true',
		template: '<canvas id={{configuration.renderTo}} width=200 height=200></canvas>',

		link: function(scope, iElement, iAttrs){
			setTimeout(function(){
				var gauge = new Gauge(scope.configuration);
				gauge.draw()
				function updateData(){
					gauge.setValue(scope.data);
				}
				scope.$watch('[data]', updateData, true);
				updateData()
			},300)
			
		}

	}
});


