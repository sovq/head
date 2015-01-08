var GreenHouse = angular.module("GreenHouse", ['angularCharts']); 

GreenHouse.controller("GreenHouseCtrl", function($scope) {
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


	  
	var socket = io.connect();
	$scope.lightSwitchChage = function(){
		var toggle = "off";
		if($scope.lightSwitch){
			toggle = "on";
		}else{
			toggle = "off";
		}
		socket.emit('lightSwitch',{'lightState':toggle});
	};
	
	socket.on('temperature',function(data){
		var temperature = data.temperature;
		$scope.$apply(function(){
			$scope.my_temperature = temperature;
		});	
	});
	socket.on('temperatureSet',function(data){
			$scope.$apply(function(){
			$scope.data = data;
		});	
	});
	
	socket.on('lightSwitch',function(data){
		console.log("lightSwitch: " + data.lightState);
		$scope.$apply(function(){
			if(data.lightState=="on"){
				$scope.lightSwitch = true;
			}else{
				$scope.lightSwitch = false;
			}
		});
	});
});


