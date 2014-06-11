//Load a csv file and generate a tree of data.
d3.csv("timedata_04.2014.csv", function(csv) {
	
	var dept_order = ['Strategy', 'Design', 'Project Mgmt', 'Production', 'Principal', 'Overhead', 'Finance', 'IT', 'Ops', 'SYP Way', 'Biz Dev', 'Products'];
	
	//Populate a csv object from csv file
	var nested_data = d3.nest()
		.key(function(d) {return d.deptName;})
			.sortKeys(function(a,b) {return dept_order.indexOf(a) - dept_order.indexOf(b);})
	//	.key(function(d) {return d.client;})
	//		.sortKeys(d3.ascending)
		.entries(csv);
										
	var columns1 = ["Department", "Targeted Utilization", "Actual Utilization"];
	
	//Create a dropdown menu and populate with departments from csv object inside main content div.
	var table1 = d3.select("div.table1").append("table"),
		thead = table1.append("thead")
		tbody = table1.append("tbody").attr("class", "department");
		
	thead.append("tr")
		.selectAll("th")
		.data(columns1)
		.enter()
		.append("th")
		.text(function(d) {return d;})
		
	tbody.selectAll("tr")
		.data(nested_data)
		.enter()
		.append("tr").attr("class", "department")
			.attr("name", function(d) {return d.key;})
			.attr("id", function (d, i) {return i;})
		.on("mouseover", function(){d3.select(this).style("background-color", "#e4e4e4");})
		.on("mouseout", function(){d3.select(this).style("background-color", "white");})
		.append("td").attr("class", "department")
		.text(function(d) {return d.key;});
							
	d3.select("tbody.department")
		.selectAll("tr.department")
		.data(nested_data)
		.append("td").attr("class", "stat")
		.text(function(d) {
				
				var thours = d3.sum(d.values, function(x) {return x.target_hrs;});
				var bsl = d3.sum(d.values, function(x) {return x.baseline_hrs;});
				
				tutlz = Math.round(thours/bsl*100)+"%";
				
				return tutlz;
		})
		
	d3.select("tbody.department")
		.selectAll("tr.department")
		.data(nested_data)
		.append("td").attr("class", "stat")
		.text(function(d) {
																		
			d.values.forEach(function(h) {
				
				if(h.billable == "TRUE") {
					h.billable_hrs = h.hours;
				}
				
				var sum = d3.sum(d.values, function(x) {return x.billable_hrs;});
				var bsl = d3.sum(d.values, function(x) {return x.baseline_hrs;});
				
				utlz = Math.round(sum/bsl*100)+"%";
											
				})
			return utlz;
		});

	
	d3.select("tbody")
		.selectAll("tr.department")
		.on("click", function() {
			
			var DeptselectionArray = nested_data[this.id].values;
									
			var employeeArray = d3.nest()
				.key(function(d) {return d.employee;})
					.sortKeys(d3.ascending)
				.entries(DeptselectionArray);
																	
			d3.select("div.table2 div")
				.remove();
				
			d3.select("div.table2")
				.append("div")
				.style("opacity", 0)
				.transition().style("opacity", 1).duration(350);
			
			var table2 = d3.select("div.table2 div").append("table"),
				thead = table2.append("thead")
				tbody = table2.append("tbody").attr("class", "employee");
				
			var columns2 = ["Employee", "Targeted Utilization", "Actual Utilization"];
			
			thead.append("tr")
				.selectAll("th")
				.data(columns2)
				.enter()
				.append("th")
			//	.style("opacity", 0)
			//	.transition().style("opacity", 1).duration(450)
				.text(function(d) {return d;});
			
			tbody.selectAll("tr")
				.data(employeeArray)
				.enter()
				.append("tr")
					.attr("class", "employee")
					.attr("id", function(d, i) {return i;})
					.attr("name", function(d) {return d.key;})
				.on("mouseover", function(){d3.select(this).style("background-color", "#e4e4e4");})
				.on("mouseout", function(){d3.select(this).style("background-color", "white");})
				.append("td").attr("class", "employee")
			//	.style("opacity", 0)
			//	.transition().style("opacity", 1).delay(50).duration(450)
				.text(function(d) {return d.key;});

			d3.select("tbody.employee")
				.selectAll("tr.employee")
				.data(employeeArray)
				.append("td").attr("class", "stat")
				.style("opacity", 0)
				.transition().each(function(d, i) {
					d3.selectAll("td").transition()
						.style("opacity", 1).delay(10*i).duration(450).ease("linear")
					})						
				.text(function(d) {
						
						var thours = d3.sum(d.values, function(x) {return x.target_hrs;});
						var bsl = d3.sum(d.values, function(x) {return x.baseline_hrs;});
						
						tutlz = Math.round(thours/bsl*100)+"%";
						
						return tutlz;
				})
			
			d3.select("tbody.employee")
				.selectAll("tr.employee")
				.data(employeeArray)
				.append("td").attr("class", "stat")
				.style("opacity", 0)
				.transition().each(function(d, i) {
					d3.selectAll("td").transition()
						.style("opacity", 1).delay(10*i).duration(450).ease("linear")
					})									
				.text(function(d) {
																				
					d.values.forEach(function(h) {
						
						if(h.billable == "TRUE") {
							h.billable_hrs = h.hours;
						}
						
						var sum = d3.sum(d.values, function(x) {return x.billable_hrs;});
						var bsl = d3.sum(d.values, function(x) {return x.baseline_hrs;});
						
						utlz = Math.round(sum/bsl*100)+"%";
													
						})
					return utlz;
				});
			
			d3.select("tbody.employee")
				.selectAll("tr.employee")
				.on("click", function() {
				
					var empSelectionArray = employeeArray[this.id].values;
																			
					var tempArray = d3.nest()
						.key(function(d) {return d.task_type;})
							.sortKeys(d3.ascending)
						.entries(empSelectionArray);
													
					var pieArray = [];
					
					for(i=0; i<tempArray.length; i++) {
						if(tempArray[i].key === "") {
							
						} else {
							pieArray.push(tempArray[i])
						}
					}							
					
					var selectedEmp = this.id;
					var employeeName = this.getAttribute("name");
					
					d3.select("div.pie-chart")
						.remove();
					
					d3.select("div.tooltip")
						.remove();
									
					
					var w = 560 ,
						h = 480,
						r = 200;
						
					var textOffset = 10;
													
					var color = d3.scale.category20();
					
					var pie = d3.layout.pie()
								.value(function(d) {
									
									var hours = d3.sum(d.values, function(x) {return x.hours;});
									
									return hours;
								});							
					//			.sort(null);
					
					var arc = d3.svg.arc()
						.outerRadius(function(d) {return r;})
						.innerRadius(r - 140);
	
					d3.select("div.pie")
						.append("div").attr("class", "pie-chart")
						.style("opacity", 0)
						.transition().style("opacity", 1).duration(250);
					

					d3.select("div.pie-chart")
						.append("h3")
						.style("opacity", 0)
						.transition().style("opacity", 1).duration(480)
						.text("Employee: "+employeeName);

					//Add radio inputs for bar or pie chart transform
					var radioID = ["pie", "bar"];
					var radioInputs = ["pie chart", "bar chart"];
					
					var form = d3.select("div.pie-chart").append("form")
					
					var labelEnter = form.selectAll("ul")
						.data(radioInputs)
						.enter().append("ul")								
					
					labelEnter.append("input")
						.attr({
							type: "radio",
							class: "shape",
							id: function(d, i) {return i;},
							name: "graphtype",
							value: function(d, i) {return i;}
						})
						.property("checked", function(d, i) {return (i===0);});
						
					labelEnter.append("label")
						.text(function(d) {return d;})
						.attr("font-size", "9px");
																
					var svg = d3.select("div.pie-chart")
								.append("svg")
								.attr("width", w)
								.attr("height", h)
								.append("g")
								.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
								  
					var g = svg.selectAll("path")
								.data(pie(pieArray))
								.enter()
								.append("g")
								.attr("class", "arc");
					
							
					//tooltip div														
					var tooltip = d3.select("div")
						.append("div")
						.attr("class", "tooltip")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "hidden")
																															
					g.append("path")
						.attr("d", arc)
						.style("opacity", 0)
						.data(pieArray)
						.attr("client", function(d) {return d.key;})
						.attr("id", function(d, i) {return i;})
						.style("fill", function(d, i) {
							return color(i);
						})
						//Trigger to display tooltip div
						.on("mouseover", function() {
								
								var selectedClient = this.getAttribute("client");
								
								var newArray = pieArray[this.id].values;
								
								var highlight = d3.select(this).transition()
													.duration(300)
													.style("fill-opacity", "0.5");
								
								if(selectedClient === "General Admin" || 
									selectedClient === "SY Projects" ||
									selectedClient === "Out of Office") {
									var newdata = d3.nest()
										.key(function(d) {return d.task;})
											.sortKeys(d3.ascending)
										.entries(newArray);
								} else {
									var newdata = d3.nest()
										.key(function(d) {return d.project_name;})
											.sortKeys(d3.ascending)
										.entries(newArray);
								}
								
								var tooltiptext = d3.select("div.tooltip")
													.append("div")
													.append("ul")
													.append("li")
													.selectAll("li")
													.data(newdata)
													.enter()
													.append("li")
												//	.style("fill-opacity", 0)
												//	.transition().style("opacity", 1).delay(150)
													.text(function(d) {
														
														var hours = d3.sum(d.values, function(x) {return x.hours;});
														
														return d.key+": "+hours+" hrs";});
								
						//		console.log(tooltiptext);					
																																				
								return highlight+tooltip.style("visibility", "visible")+tooltiptext;})
                        .on("mousemove", function() {return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                        .on("mouseout", function() {
                        
                        	var unhighlight = d3.select(this).transition()
                        						.style("fill-opacity", "1")
                        	
                        	var remove = d3.select("div.tooltip div")
                        					.remove();
                        	
                        	return unhighlight+tooltip.style("visibility", "hidden")+remove;});

					
					var labels = g.append("text")
						.style("opacity", 0)
					    .attr("transform", function(d) {
					        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (r + textOffset) + "," + 
					        	Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (r + textOffset) + ")";
					    })
					    .attr("text-anchor", function(d){
					        if ((d.startAngle  +d.endAngle) / 2 < Math.PI) {
					            return "beginning";
					        } else {
					            return "end";
					        }
					    })
					    .attr("font-size", "11px")
					    .attr("id", "wrapme")
					    .text(function(d) {return d.data.key;});						
					
					var prev;
					labels.each(function(d, i) {
					    if(i > 0) {
					        var thisbb = this.getBoundingClientRect(),
					            prevbb = prev.getBoundingClientRect();
					        // move if they overlap
					        if(!(thisbb.right < prevbb.left || 
					                thisbb.left > prevbb.right || 
					                thisbb.bottom < prevbb.top || 
					                thisbb.top > prevbb.bottom)
						) {
					            var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
					                cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
					                cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
					                cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
					                off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
					            d3.select(this).attr("transform", "translate(" + Math.cos(((d.startAngle + d.endAngle - 
					            Math.PI) / 2)) * (r + textOffset + off) + "," + Math.sin((d.startAngle + d.endAngle - 
					            Math.PI) / 2) * (r + textOffset + off) + ")");
					        }
					    }
					    prev = this;
					});
					
			//		d3.select("text#wrapme").textwrap(bounds, 50);
					
					d3.selectAll("path").transition().style("opacity", 1).delay(400).duration(400);
					d3.selectAll("text").transition().style("opacity", 1).delay(400).duration(500);
					
					d3.selectAll("input")
						.on("change", function() {
						
							var selection = parseFloat(this.id);
							
							if(selection === 0) {
																	
								d3.select("svg").transition().style("opacity", 0).duration(500).remove();
								
								var svg = d3.select("div.pie-chart")
											.append("svg")
											.attr("width", w)
											.attr("height", h)
											.append("g")
											.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");														  
								var g = svg.selectAll("path")
											.data(pie(pieArray))
											.enter()
											.append("g")
											.attr("class", "arc");
																				
								g.append("path")
									.attr("d", arc)
									.style("opacity", 0)
									.data(pieArray)
									.attr("client", function(d) {return d.key;})
									.attr("id", function(d, i) {return i;})
									.style("fill", function(d, i) {
										return color(i);
									})
									//Trigger to display tooltip div
									.on("mouseover", function() {
											
											var selectedClient = this.getAttribute("client");
											
											var newArray = pieArray[this.id].values;
											
											var highlight = d3.select(this).transition()
												.duration(300)
												.style("fill-opacity", "0.5")
											
											if(selectedClient === "General Admin" || 
												selectedClient === "SY Projects" || 
												selectedClient === "Out of Office") {
												var newdata = d3.nest()
													.key(function(d) {return d.task;})
														.sortKeys(d3.ascending)
													.entries(newArray);
											} else {
												var newdata = d3.nest()
													.key(function(d) {return d.project_name;})
														.sortKeys(d3.ascending)
													.entries(newArray);
											}
											
											var tooltiptext = d3.select("div.tooltip")
																.append("div")
																.append("ul")
																.append("li")
																.selectAll("li")
																.data(newdata)
																.enter()
																.append("li")
																.text(function(d) {
																	var hours = d3.sum(d.values, function(x) {return x.hours;});
																	return d.key+": "+hours+" hrs";
																});

											return highlight+tooltip.style("visibility", "visible")+tooltiptext;})
                                    .on("mousemove", function() {return tooltip.style("top", (event.pageY-10)+"px").
                                    	style("left",(event.pageX+10)+"px");})
	                                .on("mouseout", function() {
	                                
	                                	var unhighlight = d3.select(this).transition()
                    						.style("fill-opacity", "1");
	                                	
	                                	var remove = d3.select("div.tooltip div").remove();
	                                	
	                                	return unhighlight+tooltip.style("visibility", "hidden")+remove;
	                                });

								
								var labels = g.append("text").style("opacity", 0)
								    .attr("transform", function(d) {
								        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (r + textOffset) + "," + 
								        	Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (r + textOffset) + ")";
								    })
								    .attr("text-anchor", function(d){
								        if ((d.startAngle  +d.endAngle) / 2 < Math.PI) {
								            return "beginning";
								        } else {
								            return "end";
								        }
								    })
								    .attr("font-size", "11px")
								    .text(function(d) {return d.data.key;});						
								
								var prev;
								labels.each(function(d, i) {
								    if(i > 0) {
								        var thisbb = this.getBoundingClientRect(),
								            prevbb = prev.getBoundingClientRect();
								        // move if they overlap
								        if(!(thisbb.right < prevbb.left || 
								                thisbb.left > prevbb.right || 
								                thisbb.bottom < prevbb.top || 
								                thisbb.top > prevbb.bottom)
										) {
								            var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
								                cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
								                cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
								                cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
								                off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
								            d3.select(this).attr("transform", "translate(" + Math.cos(((d.startAngle + d.endAngle - 
								            	Math.PI) / 2)) * (r + textOffset + off) + "," + Math.sin((d.startAngle + d.endAngle - 
								            	Math.PI) / 2) * (r + textOffset + off) + ")");
										}
								    }
								    prev = this;
								});
							d3.selectAll("path").transition().style("opacity", 1).delay(400).duration(600);
							d3.selectAll("text").transition().style("opacity", 1).delay(400).duration(700);
							
							}
							//draw bar graph
							if(selection === 1) {
							
								d3.select("svg").transition()
									.style("opacity", 0).duration(500).remove();
									
								var margin = {top: 12, right: 12, bottom: 20, left: 40},
								    width = 550 - margin.left - margin.right,
								    height = 450 - margin.top - margin.bottom;
								
								var x = d3.scale.ordinal()
								    .rangeRoundBands([0, width], .1);
								
								var y = d3.scale.linear()
								    .range([height, 0]);
								
								var xAxis = d3.svg.axis()
								    .scale(x)
								    .orient("bottom");
								
								var yAxis = d3.svg.axis()
								    .scale(y)
								    .orient("left")
								    .ticks(10);
								
								var svg = d3.select("div.pie-chart").append("svg")
								    .attr("width", width + margin.left + margin.right)
								    .attr("height", height + margin.top + margin.bottom)
									.append("g")
								    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
								    
								x.domain(pieArray.map(function(d) {return d.key;}));
							  	y.domain([0, d3.max(pieArray, function(d) { 
									var hours = parseFloat(d3.sum(d.values, function(x) {return x.hours;}));
									return hours;
							  	})]);
								
							  	svg.append("g")
								      .attr("class", "x axis")
								      .attr("transform", "translate(0," + height + ")")
								      .call(xAxis)
								      .style("opacity", 0)
								      .transition().style("opacity", 1).delay(400).duration(600);
								
								svg.append("g")
								      .attr("class", "y axis")
								      .call(yAxis)
								      .style("opacity", 0)
								    .append("text")
								      .attr("transform", "rotate(-90)")
								      .attr("y", 6)
								      .attr("dy", ".71em")
								      .style("text-anchor", "end")
								      .text("Hours");
								
								svg.selectAll(".bar")
								      .data(pieArray)
								    .enter().append("rect")
								    	.style("opacity", 0)

								      .attr("class", "bar")
								      .attr("client", function(d) {return d.key;})
								      .attr("id", function(d, i) {return i;})
								      .attr("x", function(d, i) {return x(d.key); })
								      .attr("width", x.rangeBand())
								      .attr("y", function(d) {
								      	var hours = parseFloat(d3.sum(d.values, function(x) {return x.hours;}));
								      	
								      	return y(hours);})
								      .attr("height", function(d) {
								      	var hours = parseFloat(d3.sum(d.values, function(x) {return x.hours;}));
								      	 
								      	return height - y(hours);})
								      .style("fill", function(d, i) {return color(i);})
									.on("mouseover", function() {
											
											var selectedClient = this.getAttribute("client");
										//	var selectedClientId = this.id;
											
											var newArray = pieArray[this.id].values;
											
											var highlight = d3.select(this).transition()
																.duration(300)
																.style("fill-opacity", "0.5");
											
											if(selectedClient === "General Admin" || 
												selectedClient === "SY Projects" ||
												selectedClient === "Out of Office") {
												var newdata = d3.nest()
													.key(function(d) {return d.task;})
														.sortKeys(d3.ascending)
													.entries(newArray);
											} else {
												var newdata = d3.nest()
													.key(function(d) {return d.project_name;})
														.sortKeys(d3.ascending)
													.entries(newArray);
											}
											
											var tooltiptext = d3.select("div.tooltip")
																.append("div")
																.append("ul")
																.append("li")
																.selectAll("li")
																.data(newdata)
																.enter()
																.append("li")
																.text(function(d) {
																	
																	var hours = d3.sum(d.values, function(x) {return x.hours;});
																	
																	return d.key+": "+hours+" hrs";});																																										
											return highlight+tooltip.style("visibility", "visible")+tooltiptext;})
                                    .on("mousemove", function() {return tooltip.style("top", (event.pageY-10)+"px")
                                    	.style("left",(event.pageX+10)+"px");})
	                                .on("mouseout", function() {
	                                
	                                	var unhighlight = d3.select(this).transition()
	                                						.style("fill-opacity", "1")
	                                	
	                                	var remove = d3.select("div.tooltip div")
	                                					.remove();
	                                	
	                                	return unhighlight+tooltip.style("visibility", "hidden")+remove;});
								
								d3.selectAll("g").transition()
									.style("opacity", 1).delay(400).duration(600);	

								d3.selectAll("rect").transition()
									.style("opacity", 1).delay(400).duration(600);							
							}
						
						});
					
				});
			
		});

});
