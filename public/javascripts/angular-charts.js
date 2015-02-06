angular.module('angularCharts', ['angularChartsTemplates']);

angular.module('angularCharts').directive('acChart', [
	'$templateCache',
	'$compile',
	'$rootElement',
	'$window',
	'$timeout',
	'$sce',
	function ($templateCache, $compile, $rootElement, $window, $timeout, $sce) {

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

		
		function link(scope, element, attrs) {
			var config ={
					title: '',
					tooltips: true,
					labels: false,
					mouseover: function () {},
					mouseout: function () {},
					click: function () {},
					legend: {
						display: true,
						position: 'left',
						htmlEnabled: false
					},
					yAxisTickValues:null,
					yAxisTickFormat:null,
					colors: [],
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
     
		function loader(mainsvg,config) {
			return function() {
				var radius = Math.min(config.width, config.height) / 2;
				var tau = 2 * Math.PI;
				var arc = d3.svg.arc()
					.innerRadius(radius*0.5)
					.outerRadius(radius*0.9)
					.startAngle(0);
				var myg = mainsvg.append("g")
					.attr("width", totalWidth)
					.attr("height", totalWidth)
					.attr("transform", "translate("+config.x+","+config.y+")")
			 
				var spinnersvg = myg.append("svg")
					.attr("id", config.id)
					.attr("width", config.width)
					.attr("height", config.height)
					.append("g")
					.attr("transform", "translate(" + config.width /2  + "," + config.height / 2 + ")")

				var background = spinnersvg.append("path")
					.datum({endAngle: 0.33*tau})
					.style("fill", "#4D4D4D")
					.attr("d", arc)
					.call(spin, 500)

				function spin(selection, duration) {
					selection.transition()
						.ease("linear")
						.duration(duration)
						.attrTween("transform", function() {
							return d3.interpolateString("rotate(0)", "rotate(360)");
						});
					setTimeout(function() { spin(selection, duration); }, duration);
				}

				function transitionFunction(path) {
					path.transition()
						.duration(7500)
						.attrTween("stroke-dasharray", tweenDash)
						.each("end", function() { d3.select(this).call(transition); });
				}

			};
		}
     
		function init() {
				
				
				setHeightWidth();
				setContainers();
				prepareData();
				lineChart();
					
				
			
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
					width = totalWidth;
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
		function prepareData() {
			data = clone(scope.acData);
			chartType = scope.acChart;
			series = data ? data.series || [] : [];
			points = data ? data.data || [] : [];

			if (scope.acConfig) {
				angular.extend(config, scope.acConfig);
			}
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
				right: 40,
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
			var yAxis = d3.svg.axis().scale(y).orient('left').ticks(6).tickFormat(config.yAxisTickFormat).tickValues(config.yAxisTickValues);
			var line = d3.svg.line().interpolate(config.lineCurveType).x(function (d) {
				return getX(d.x);
			}).y(function (d) {
				return y(d.y);
			});
			var yData = [];
			var linedata = [];

			
			points.forEach(function (d) {
				if(!(d.y[0]=="no_data"||d.y[0]=="future")){
					d.draw = [true,true];
				}else{
					d.draw = [false,true];
					d.y[0]=0;																						
				}
				d.y.map(function (e) {
						yData.push(e);
				});
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
							tooltip: point.tooltip,
							draw : point.draw
						};
					})[index] 
				});
			  	var actualValues = [];
				var lineChunksArray = [];
				var lineContinues = false
				for(a=0;a<d.values.length;a++){
					var item = d.values[a];
					if(item.draw[index] ){
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
				if(actualValues.length!=0){
					lineChunksArray.push(actualValues);
				}
	 			lineChunksArray.forEach(function(item){
					var label = '';
					if (series=='loading'){
						label='loading';
					}
					linedata.push({series:label,values:item});  
				})
				if(linedata.length != 0){
					linedata[linedata.length-1].series=value;
				}else{
					d.series='no data'
					linedata.push(d)
				}
			});
			
			var svg = d3.select(chartContainer[0]).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
			var setDifferenece = 	d3.max(yData) - d3.min(yData);
   
			if(config.yAxisTickValues == null){
				y.domain([
					d3.min(yData) - (1),
					d3.max(yData) + (2)
				]);
			}
			
			svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
			svg.append('g').attr('class', 'y axis').call(yAxis);
			if(series!='loading'||series==null){
		
				var point = svg.selectAll('.points').data(linedata).enter().append('g');
				var path = point.attr('points', 'points').append('path').attr('class', 'ac-line').style('stroke', function (d, i) {
					if(d.series=='dry'){
						return getColor(1);
					}else{
						return getColor(0);
					}
				}).attr('d', function (d) {
					return line(d.values);
				}).attr('stroke-width', '2').attr('fill', 'none');
			}else{
				
				//right: 40,
				//bottom: 20,
				//left: 40

				//chartx=(totalWidth-margin.left)/2)
				//charty=
				var mypositionx =((totalWidth/2)-(totalHeight/4))
				var mypositiony =(((totalHeight-margin.bottom)/2)-(totalHeight/4))
				
				var myLoader = loader(svg,{width: totalHeight/4, height: totalHeight/4, container: chartContainer[0], id: "loader",x:mypositionx,y:mypositiony});
				myLoader();
				
			}
			
			
			     /*
      * 
      * 

var myLoader = loader({width: 960, height: 500, container: "#loader_container", id: "loader"});
myLoader();
        /** Animation function
       * [last description]
       * @type {[type]}
       */
			if (linedata.length > 0 && series!='loading') {
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
				if (value.series!='loading'&&value.series!='no data'&&value.series!='dry'){
					var points = svg.selectAll('.circle').data(removeNoDataAndFuture(value.values)).enter();
					points.append('circle').attr('cx', function (d) {
						return getX(d.x);
					}).attr('cy', function (d) {
						return y(d.y);
					}).attr('r', 1.5).style('fill', getColor(0)).style('stroke', getColor(0)).on('mouseover', function (series) {
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
				}
		});
        /**
       * Labels at the end of line
       */
        if (config.lineLegend === 'lineEnd'&&series!='loading') {
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


      function getColor(i) {
		color = ['blue','red']
        return color[i];
        
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
    "<div class=\"angular-charts-template\"><div class=\"ac-title\">{{acConfig.title}}</div><div class=\"ac-chart\"></div></div>");
}]);
