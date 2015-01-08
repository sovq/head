;(function(angular){
  'use strict';
  var indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };

  angular.module('pickadate', [])

    .provider('pickadateI18n', function() {
      var defaults = {
        'prev': 'prev',
        'next': 'next'
      };

      this.translations = {};

      this.$get = function() {
        var translations = this.translations;

        return {
          t: function(key) {
            return translations[key] || defaults[key];
          }
        };
      };
    })

    .factory('pickadateUtils', ['$locale', function($locale) {
      return {
        isDate: function(obj) {
          return Object.prototype.toString.call(obj) === '[object Date]';
        },

        stringToDate: function(dateString) {
          if (this.isDate(dateString)) return new Date(dateString);
          var dateParts = dateString.split('-'),
            year  = dateParts[0],
            month = dateParts[1],
            day   = dateParts[2];

          // set hour to 3am to easily avoid DST change
          return new Date(year, month - 1, day, 3);
        },
        
        getThreeWeeks: function(date, options) {
			var dates = [];
			while (date.getDay() !== options.weekStartsOn) {
				date.setDate(date.getDate() - 1);
			}
			date.setDate(date.getDate() - 7);
			
			for (var i = 0; i < 21; i++) {  // 42 == 6 rows of dates
				dates.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}

			return dates;
			
		},
		
		getWeekNumber: function(d){
			// Copy date so don't modify original
			d = new Date(+d);
			d.setHours(0,0,0);
			// Set to nearest Thursday: current date + 4 - current day number
			// Make Sunday's day number 7
			d.setDate(d.getDate() + 4 - (d.getDay()||7));
			// Get first day of year
			var yearStart = new Date(d.getFullYear(),0,1);
			// Calculate full weeks to nearest Thursday
			var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
			// Return array of year and week number
			return weekNo;
		},
		
        buildDates: function(date, options) {
          var dates = [],
              lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 3);

          options = options || {};
          date = new Date(date);

          while (date.getDay() !== options.weekStartsOn) {
            date.setDate(date.getDate() - 1);
          }

          for (var i = 0; i < 42; i++) {  // 42 == 6 rows of dates
            if (options.noExtraRows && date.getDay() === options.weekStartsOn && date > lastDate) break;

            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
          }

          return dates;
        },

        buildDayNames: function(weekStartsOn) {
          var dayNames = $locale.DATETIME_FORMATS.SHORTDAY;

          if (weekStartsOn) {
            dayNames = dayNames.slice(0);
            for (var i = 0; i < weekStartsOn; i++) {
              dayNames.push(dayNames.shift());
            }
          }
          return dayNames;
        }
      };
    }])

    .directive('pickadate', ['$locale', 'pickadateUtils', 'pickadateI18n', 'dateFilter' ,'$http', function($locale, dateUtils, i18n, dateFilter,$http) {
      return {
        require: 'ngModel',
        scope: {
          date: '=ngModel',
          defaultDate: '=',
          sunset: '=sunSet',
          minDate: '=',
          maxDate: '=',
          disabledDates: '=',
          weekStartsOn: '='

        },
        template:        
			'<div class="col-xs-6 col-sm-3 col-md-1 placeholder"> '+
				'<br>' +
                '<a href="" class="pickadate-prev" ng-click="GoPrevWeek()" ng-show="allowPrevWeek"><i class="fa fa-chevron-left fa-2x"></i></a>' +
			'</div>' + 

                
            '<div class="pickadate-body col-xs-6 col-sm-3 col-md-10 placeholder">' +
              '<div class="pickadate-main">' +
                '<ul class="pickadate-cell">' +
                  '<li ng-repeat="d in dates" ng-click="setDate(d)" class="{{d.className}}" ng-class="{\'pickadate-active\': date == d.date}" style="{{d.style}}">' +
                    '{{d.dateObj | date:"MMM" }}' + '<br>' +'{{d.dateObj | date:"d" }}' + '<br>' + '{{d.dateObj | date:"EEE" }}' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="col-xs-6 col-sm-3 col-md-1 placeholder"> '+
            '<br>' +
               '<a href="" class="pickadate-next" ng-click="GoNextWeek()" ng-show="allowNextWeek"><i class="fa fa-chevron-right fa-2x"></i></a><br><br>' +
			'</div>',

        link: function(scope, element, attrs, ngModel)  {
          var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
              weekStartsOn  = 1,
              noExtraRows   = attrs.hasOwnProperty('noExtraRows'),
              currentDate   = (scope.defaultDate && dateUtils.stringToDate(scope.defaultDate)) || new Date();


          scope.dayNames    = dateUtils.buildDayNames(weekStartsOn);
          scope.currentDate = currentDate;
          scope.t           = i18n.t;

          scope.render = function(initialDate) {
			var initDate = new Date(initialDate),
			 newDate = new Date(initialDate),
			currentDate = new Date(initDate),
    //            allDates     = dateUtils.buildDates(initialDate, { weekStartsOn: weekStartsOn, noExtraRows: noExtraRows }),
                allDates 	 = dateUtils.getThreeWeeks(newDate, { weekStartsOn: weekStartsOn, noExtraRows: noExtraRows }),
                dates        = [],
                today        = dateFilter(new Date(), 'yyyy-MM-dd');

		
				
			var initialDateWeekNumber = dateUtils.getWeekNumber(initDate)
			
			var comparisonDate = new Date(initDate)
            scope.allowPrevWeek = !minDate || comparisonDate.setDate(initDate.getDate() - 7)  > minDate;
            var comparisonDate = new Date(initDate)
            scope.allowNextWeek = !maxDate || comparisonDate.setDate(initDate.getDate() + 7) <= maxDate;

            for (var i = 0; i < allDates.length; i++) {
              var className = "",
                  dateObj   = allDates[i],
                  date      = dateFilter(dateObj, 'yyyy-MM-dd');

              if (date < scope.minDate || date > scope.maxDate || initialDateWeekNumber !== dateUtils.getWeekNumber(dateObj)) {
                className = 'pickadate-disabled';
              } else {
                className = 'pickadate-enabled';
              }

              if (date === today) {
                className += ' pickadate-today';
              }
			
			
              dates.push({date: date, dateObj: dateObj, className: className});
            }

            scope.dates = dates;
          };
		  scope.getSunset = function(date){
			$http.get('/lightinfo/'+date).
					success(function(data, status, headers, config) {
						  var date = data[0];
						  scope.sunrise = date.sunrise
						  scope.sunset = date.sunset

						  
					  }).
					  error(function(data, status, headers, config) {
						  scope.sunrise = 'data not received';
						  scope.sunset = 'data not received';
						  
				});
			  
			}

          scope.setDate = function(dateObj) {
            if (isDateDisabled(dateObj)){
			}else{
				scope.getSunset(dateObj.date);
				ngModel.$setViewValue(dateObj.date);
	
			  }
		  };

          ngModel.$render = function () {
            var date;
            if (date = ngModel.$modelValue) {
              scope.currentDate = currentDate = dateUtils.stringToDate(date);
              
            } else if (date) {
              // if the initial date set by the user is in the disabled dates list, unset it
              scope.setDate({});
            }
            scope.getSunset(date);
            scope.render(currentDate);
          };

          scope.changeMonth = function (offset) {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + offset);
            scope.render(currentDate);
          };
          
          scope.GoNextWeek = function () {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(currentDate.getDate()+7);
            scope.render(currentDate);
          };
          scope.GoPrevWeek = function () {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(currentDate.getDate()-7);
            scope.render(currentDate);
          };

          function isDateDisabled(dateObj) {
            return (/pickadate-disabled/.test(dateObj.className));
          }
        }
      };
    }]);
})(window.angular);
