GreenHouseApp.directive('switchlog', ['$http','dateFilter',function($http,dateFilter) {
	
return {
	scope:	{logdata : '=',
			switchname : '='},  
	replace: 'true',
	templateUrl: 'partials/logstable',
	link: function(scope, iElement, iAttrs){
			scope.getLightSwitchLog=function(date,direction){
				$http.get('/switchlog/'+scope.switchname+'/date/'+date+'/direction/'+direction).
					success(function(data, status, headers, config) {
						console.log(data);
						scope.logdata=data;		  
					}).
					error(function(data, status, headers, config) {
						console.log('error getting data');		  
					});	
			}
			var date = new Date();
			var formatDate = dateFilter(date,"yyyy-mm-dd, HH:MM:ss");
			scope.getLightSwitchLog(formatDate,'down');
	
			scope.moveLog = function(direction){
				var index = 0;
				if(direction=='up'){
					index = 0;
				}else if(direction=='down'){
					index = scope.logdata.length-1;
				}
				if(scope.logdata.length!=0){
					var date = scope.logdata[index].date;
					scope.getLightSwitchLog(date,direction);
				}
			}
		}

	}
}]);
