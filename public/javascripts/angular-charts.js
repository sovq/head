/**
 * Main module
 */
angular.module('angularCharts', ['angularChartsTemplates']);
/**
 * Main directive handling drawing of all charts
 */
angular.module('angularCharts').directive('acChart', [
  '$templateCache',
  '$compile',
  '$rootElement',
  '$window',
  '$timeout',
  '$sce',
  function ($templateCache, $compile, $rootElement, $window, $timeout, $sce) {
    var defaultColors = [
        'steelBlue',
        'rgb(255,153,0)',
        'rgb(220,57,18)',
        'rgb(70,132,238)',
        'rgb(73,66,204)',
        'rgb(0,128,0)'
      ];
    /**
   * Utility function to call when we run out of colors!
   * @return {String} Hexadecimal color
   */
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    }
    /**
   * Utility function that gets the child that matches the classname
   * because Angular.element.children() doesn't take selectors
   * it's still better than a whole jQuery implementation
   * @param  {Array}  childrens       An array of childrens - element.children() or element.find('div')
   * @param  {String} className       Class name
   * @return {Angular.element|null}    The founded child or null
   */
    function getChildrenByClassname(childrens, className) {
      var child = null;
      for (var i in childrens) {
        if (angular.isElement(childrens[i])) {
          child = angular.element(childrens[i]);
          if (child.hasClass(className))
            return child;
        }
      }
      return child;
    }
    /**
   * Main link function
   * @param  {[type]} scope   [description]
   * @param  {[type]} element [description]
   * @param  {[type]} attrs   [description]
   * @return {[type]}         [description]
   */
    function link(scope, element, attrs) {
      var config = {
          title: '',
          tooltips: true,
          labels: false,
          mouseover: function () {
          },
          mouseout: function () {
          },
          click: function () {
          },
          legend: {
            display: true,
            position: 'left',
            htmlEnabled: false
          },
          colors: [],
          innerRadius: 0,
          lineLegend: 'lineEnd',
          lineCurveType: 'cardinal',
          isAnimate: true
        };
      var totalWidth = element[0].clientWidth;
      var totalHeight = element[0].clientHeight;
      if (totalHeight === 0 || totalWidth === 0) {
        throw new Error('Please set height and width for the chart element');
      }
      var data, series, points, height, width, chartContainer, legendContainer, chartType;
      /**
     * All the magic happens here
     * handles extracting chart type
     * getting data
     * validating data
     * drawing the chart
     * @return {[type]} [description]
     */
      function init() {
        prepareData();
        setHeightWidth();
        setContainers();
        var chartFunc = getChartFunction(chartType);
        chartFunc();
        drawLegend();
      }
      /**
     * Sets height and width of chart area based on legend
     * used for setting radius, bar width of chart
     */
      function setHeightWidth() {
        if (!config.legend.display) {
          height = totalHeight;
          width = totalWidth;
          return;
        }
        switch (config.legend.position) {
        case 'top':
        case 'bottom':
          height = totalHeight * 0.75;
          width = totalWidth;
          break;
        case 'left':
        case 'right':
          height = totalHeight;
          width = totalWidth * 0.75;
          break;
        }
      }
      /**
     * Creates appropriate DOM structure for legend + chart
     */
      function setContainers() {
        var container = $templateCache.get('angularChartsTemplate_' + config.legend.position);
        element.html(container);
        //http://stackoverflow.com/a/17883151
        $compile(element.contents())(scope);
        //getting children divs
        var childrens = element.find('div');
        chartContainer = getChildrenByClassname(childrens, 'ac-chart');
        legendContainer = getChildrenByClassname(childrens, 'ac-legend');
        height -= getChildrenByClassname(childrens, 'ac-title')[0].clientHeight;
      }
      /**
     * Parses data from attributes
     * @return {[type]} [description]
     */
      function prepareData() {
        data = scope.acData;
        chartType = scope.acChart;
        series = data ? data.series || [] : [];
        points = data ? data.data || [] : [];
        if (scope.acConfig) {
          angular.extend(config, scope.acConfig);
        }
      }
      /**
     * Returns appropriate chart function to call
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
      function getChartFunction(type) {
        var charts = {
            'line': lineChart
          };
        return charts[type];
      }
      /**
     * Filters down the x axis labels if a limit is specified
     */
      function filterXAxis(xAxis, x) {
        var allTicks = x.domain();
        if (config.xAxisMaxTicks && allTicks.length > config.xAxisMaxTicks) {
          var mod = Math.ceil(allTicks.length / config.xAxisMaxTicks);
          xAxis.tickValues(allTicks.filter(function (e, i) {
            return i % mod === 0;
          }));
        }
      }
      
      function filterYAxis(yAxis,y) {
			alert(y.domain());
			return 0;
	  }
      /**
     * Draws a line chart
     * @return {[type]} [description]
     */
      function lineChart() {
        var margin = {
            top: 0,
            right: 80,
            bottom: 20,
            left: 40
          };
        width -= margin.left + margin.right;
        height -= margin.top + margin.bottom;
        var x = d3.scale.ordinal().domain(points.map(function (d) {
            return d.x;
          })).rangeRoundBands([
            0,
            width
          ]);
        var y = d3.scale.linear().range([
            height,
            10
          ]);
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        filterXAxis(xAxis, x);
		var yAxis = d3.svg.axis().scale(y).orient('left').ticks(6).tickFormat(d3.format('s'));
        var line = d3.svg.line().interpolate(config.lineCurveType).x(function (d) {
            return getX(d.x);
          }).y(function (d) {
            return y(d.y);
          });
        var yData = [];
        var linedata = [];
        points.forEach(function (d) {
		  if(!(d.y[0]=="no_data"||d.y[0]=="future")){
          d.y.map(function (e) {
            yData.push(e);
          });
			}
        });
        var yMaxPoints = d3.max(points.map(function (d) {
            return d.y.length;
          }));
        scope.yMaxData = yMaxPoints;
        series.slice(0, yMaxPoints).forEach(function (value, index) {
          var d = {};
          d.series = value;
          d.values = points.map(function (point) {
            return point.y.map(function (e) {
              return {
                x: point.x,
                y: e,
                tooltip: point.tooltip
              };
            })[index] 
          });
          
          var actualValues = [];
          var lineChunksArray = [];
          var lineContinues = false;
          
          for(a=0;a<d.values.length;a++){
	
			  var item = d.values[a];
			  
			  if(item.y!="future" && item.y!="no_data"){
				  actualValues.push(item);
				  lineContinues = true;
			  }else{
				  if(lineContinues==true){
					lineChunksArray.push(actualValues);
				  }
				  actualValues = [];
				  lineContinues = false;
			  }
		  }
		  
		  
		   
		  lineChunksArray.forEach(function(item){
			linedata.push({series:"",values:item});  
		  })
		  linedata[linedata.length-1].series=value;
        });
        var svg = d3.select(chartContainer[0]).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		var setDifferenece = 	d3.max(yData) - d3.min(yData);
   
        y.domain([
          d3.min(yData) - (setDifferenece*1.05),
          d3.max(yData) + (setDifferenece*1.05)
        ]);
        svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
        svg.append('g').attr('class', 'y axis').call(yAxis);
        var point = svg.selectAll('.points').data(linedata).enter().append('g');
        var path = point.attr('points', 'points').append('path').attr('class', 'ac-line').style('stroke', function (d, i) {
            return getColor(i);
          }).attr('d', function (d) {
            return line(d.values);
          }).attr('stroke-width', '2').attr('fill', 'none');
        /** Animation function
       * [last description]
       * @type {[type]}
       */
        if (linedata.length > 0) {
          var last = linedata[linedata.length - 1].values;
          if (last.length > 0) {
            var totalLength = path.node().getTotalLength() + getX(last[last.length - 1].x);
            path.attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength).transition().ease('linear').attr('stroke-dashoffset', 0).attr('d', function (d) {
              return line(d.values);
            });
          }
        }
        /**
       * Add points
       * @param  {[type]} value [description]
       * @param  {[type]} key   [description]
       * @return {[type]}       [description]
       */
        angular.forEach(linedata, function (value, key) {
		  
          var points = svg.selectAll('.circle').data(removeNoDataAndFuture(value.values)).enter();
          points.append('circle').attr('cx', function (d) {
            return getX(d.x);
          }).attr('cy', function (d) {
            return y(d.y);
          }).attr('r', 1.5).style('fill', getColor(linedata.indexOf(value))).style('stroke', getColor(linedata.indexOf(value))).on('mouseover', function (series) {
            return function (d) {
              makeToolTip({
                index: d.x,
                value: d.tooltip ? d.tooltip : d.y,
                series: series
              }, d3.event);
              config.mouseover(d, d3.event);
              scope.$apply();
            };
          }(value.series)).on('mouseleave', function (d) {
            removeToolTip();
            config.mouseout(d, d3.event);
            scope.$apply();
          }).on('mousemove', function (d) {
            updateToolTip(d3.event);
          }).on('click', function (d) {
            config.click(d, d3.event);
            scope.$apply();
          });
          if (config.labels) {
            points.append('text').attr('x', function (d) {
              return getX(d.x);
            }).attr('y', function (d) {
              return y(d.y);
            }).text(function (d) {
              return d.y;
            });
          }
        });
        /**
       * Labels at the end of line
       */
        if (config.lineLegend === 'lineEnd') {
          point.append('text').datum(function (d) {
            return {
              name: d.series,
              value: d.values[d.values.length - 1]
            };
          }).attr('transform', function (d) {
            return 'translate(' + getX(d.value.x) + ',' + y(d.value.y) + ')';
          }).attr('x', 3).text(function (d) {
            return d.name;
          });
        }
        /**
       * Returns x point of line point
       * @param  {[type]} d [description]
       * @return {[type]}   [description]
       */
        function getX(d) {
          return Math.round(x(d)) + x.rangeBand() / 2;
        }
        return linedata;
      }

	function removeNoDataAndFuture(array){
		var actualValues = [];
		  for(i=0;i<array.length;i++){
			  var myVar = array[i]
			  if(!(myVar.y == "future" || myVar.y == "no_data")){
				  actualValues.push(myVar);
			  }
		  }
		 return actualValues;
	}

      /**
     * Creates and displays tooltip
     * @return {[type]} [description]
     */
      function makeToolTip(data, event) {
        if (!config.tooltips) {
          return;
        }
        if (typeof config.tooltips === 'function') {
          data = config.tooltips(data);
        } else {
          data = data.value;
        }
        var el = angular.element('<p class="ac-tooltip"></p>').html(data).css({
            left: event.pageX + 20 + 'px',
            top: event.pageY - 30 + 'px'
          });
        angular.element(document.querySelector('.ac-tooltip')).remove();
        angular.element(document.body).append(el);
        scope.$tooltip = el;
      }
      /**
     * Clears the tooltip from body
     * @return {[type]} [description]
     */
      function removeToolTip() {
        if (scope.$tooltip) {
          scope.$tooltip.remove();
        }
      }
      function updateToolTip(event) {
        if (scope.$tooltip) {
          scope.$tooltip.css({
            left: event.pageX + 20 + 'px',
            top: event.pageY - 30 + 'px'
          });
        }
      }
      /**
     * Adds data to legend
     * @return {[type]} [description]
     */
      function drawLegend() {
        scope.legends = [];
        if (chartType === 'pie') {
          angular.forEach(points, function (value, key) {
            scope.legends.push({
              color: config.colors[key],
              title: getBindableTextForLegend(value.x)
            });
          });
        }
        if (chartType === 'bar' || chartType === 'area' || chartType === 'point' || chartType === 'line' && config.lineLegend === 'traditional') {
          angular.forEach(series, function (value, key) {
            scope.legends.push({
              color: config.colors[key],
              title: getBindableTextForLegend(value)
            });
          });
        }
      }
      var HTML_ENTITY_MAP = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\'': '&#39;',
          '/': '&#x2F;'
        };
      function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (char) {
          return HTML_ENTITY_MAP[char];
        });
      }
      function getBindableTextForLegend(text) {
        return $sce.trustAsHtml(config.legend.htmlEnabled ? text : escapeHtml(text));
      }
      /**
     * Checks if index is available in color
     * else returns a random color
     * @param  {[type]} i [description]
     * @return {[type]}   [description]
     */
      function getColor(i) {
        return 'blue';
        
      }
      var w = angular.element($window);
      var resizePromise = null;
      w.bind('resize', function (ev) {
        resizePromise && $timeout.cancel(resizePromise);
        resizePromise = $timeout(function () {
          totalWidth = element[0].clientWidth;
          totalHeight = element[0].clientHeight;
          init();
        }, 100);
      });
      scope.getWindowDimensions = function () {
        return {
          'h': w[0].clientHeight,
          'w': w[0].clientWidth
        };
      };
      // Watch for any of the config changing.
      scope.$watch('[acChart, acData, acConfig]', init, true);
      scope.$watch(function () {
        return {
          w: element[0].clientWidth,
          h: element[0].clientHeight
        };
      }, function (newvalue) {
        totalWidth = newvalue.w;
        totalHeight = newvalue.h;
        init();
      }, true);
    }
    return {
      restrict: 'EA',
      link: link,
      transclude: 'true',
      scope: {
        acChart: '=',
        acData: '=',
        acConfig: '='
      }
    };
  }
]);
(function () {
    // styles.min.css
    var cssText = "" +
".angular-charts-template .axis path,.angular-charts-template .axis line{fill:none;stroke:#333}.angular-charts-template .ac-title{font-weight:700;font-size:1.2em}.angular-charts-template .ac-chart{float:left;width:75%}.angular-charts-template .ac-line{fill:none;stroke-width:2px}.angular-charts-template table{float:left;max-width:25%;list-style:none;margin:0;padding:0}.angular-charts-template td[ng-bind]{display:inline-block}.angular-charts-template .ac-legend-box{border-radius:5px;height:15px;width:15px}.ac-tooltip{display:block;position:absolute;border:2px solid rgba(51,51,51,.9);background-color:rgba(22,22,22,.7);border-radius:5px;padding:5px;color:#fff}";
    // cssText end

    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }
}());

angular.module('angularChartsTemplates', ['angularChartsTemplate_left', 'angularChartsTemplate_right']);

angular.module("angularChartsTemplate_left", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("angularChartsTemplate_left",
    "<div class=\"angular-charts-template\"><div class=\"ac-title\">{{acConfig.title}}</div><div class=\"ac-legend\" ng-show=\"{{acConfig.legend.display}}\"><table><tr ng-repeat=\"l in legends\"><td><div class=\"ac-legend-box\" ng-attr-style=\"background:{{l.color}};\"></div></td><td ng-bind-html=\"l.title\"></td></tr></table></div><div class=\"ac-chart\"></div></div>");
}]);

angular.module("angularChartsTemplate_right", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("angularChartsTemplate_right",
    "<div class=\"angular-charts-template\"><div class=\"ac-title\">{{acConfig.title}}</div><div class=\"ac-chart\"></div><div class=\"ac-legend\" ng-show=\"{{acConfig.legend.display}}\"><table><tr ng-repeat=\"l in legends | limitTo:yMaxData\"><td><div class=\"ac-legend-box\" ng-attr-style=\"background:{{l.color}};\"></div></td><td ng-bind-html=\"l.title\"></td></tr></table></div></div>");
}]);
