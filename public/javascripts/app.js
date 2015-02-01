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
		  controller: 'WateringController'	
      }).when('/temperature',{
		  templateUrl: 'partials/temperature',
		  controller: 'TemperatureController'		  
	  }).
      when('/404',{
		   templateUrl: 'partials/404',
	  }).
      otherwise({
        redirectTo: '404'
      });
}]);
