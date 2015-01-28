var GreenHouseApp = angular.module('GreenHouseApp', [
  'ngRoute','pickadate','angularCharts'
]);

GreenHouseApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/',{
		   templateUrl: 'partials/home',
	  }).
      when('/lighting', {
        templateUrl: 'partials/lighting',
        controller: 'LightScheduleController'
      }).
      when('/watering', {
        templateUrl: 'partials/watering',
      }).when('/temperature',{
		  templateUrl: 'partials/temperature',
//		  controller: 'LogsDisplayController'		  
	  }).
      when('/404',{
		   templateUrl: 'partials/404',
	  }).
      otherwise({
        redirectTo: '404'
      });
}]);

GreenHouseApp.controller('LightScheduleController', ['$scope','dateFilter', function($scope,dateFilter) {
		$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
        $scope.minDate = '2014-11-01';
        $scope.maxDate = '2015-05-15';
        $scope.disabledDates = [];
        $scope.sunset = 'data not received';
		
        
        var socket = io.connect();
        $scope.lightSwitchChage = function(){
			var toggle = $scope.lightSwitchOn;
			if(toggle){
				$scope.lightSwitch = 'off';
			}else{
				$scope.lightSwitch = 'on';
			}
			socket.emit('lighting',{'lightState':$scope.lightSwitch});
		};
		
		$scope.lightScheduleSwitchChage = function(){
			var toggle = $scope.lightScheduleSwitchOn;
			if(toggle){
				$scope.lightScheduleSwitchState = 'off';
			}else{
				$scope.lightScheduleSwitchState = 'on';
			}
			socket.emit('SchedulerStatusChanged',{'schedulerState':$scope.lightScheduleSwitchState});
		};
		
		socket.on('SchedulerStatus',function(data){
			console.log("SchedulerStatus: " + data.schedulerState);
			
			$scope.$apply(function(){
				if(data.schedulerState=="on"){
					$scope.lightScheduleSwitchState = 'on';
					$scope.lightScheduleSwitchOn=true;
					$scope.lightScheduleSwitchOff=false;
				}else{
					$scope.lightScheduleSwitchState = 'off';
					$scope.lightScheduleSwitchOn=false;
					$scope.lightScheduleSwitchOff=true;
				}
			});
		});
		
		socket.on('lighting',function(data){
			console.log("lightSwitch: " + data);
			$scope.$apply(function(){
				if(data=="on"){
					$scope.lightSwitchState = 'on';
					$scope.lightSwitchOn=true;
					$scope.lightSwitchOff=false;
				}else{
					$scope.lightSwitchState = 'off';
					$scope.lightSwitchOn=false;
					$scope.lightSwitchOff=true;
				}
			});
		});
		socket.emit('lighting',{'lightState':'status'});
}]);	
