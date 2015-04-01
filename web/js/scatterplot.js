var margin = {top: 20, right: 20, bottom: 20, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");


var xValue = function(d) {return d.total_hrs / d.baseline_hrs;},
	xScale = d3.scale.linear().range([0, width]),
	xMap = function(d) {return xScale(xValue(d));},
	xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent);

var	xScale2 = d3.scale.ordinal().rangeRoundBands([0, width], 1),
	xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom");

var yValue = function(d) {return d.utilized_hrs / d.baseline_hrs;},
	yScale = d3.scale.linear().range([height, 0]),
	yMap = function(d) {return yScale(yValue(d));},
	yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatPercent);

var cValue = function(d) {return d.dept_name;},
	color = d3.scale.category10();

var svg = d3.select(".content2").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select(".content2").append("div")
	.attr("class", "tooltip2")
	.style("z-index", 20)
	.style("opacity", 0);

var formatPercent = d3.format(".0%");

d3.csv("timedata_ytd02.2015v2.csv", function(error, data) {

	xScale.domain([d3.min(data, xValue)-0.1, d3.max(data, xValue)+0.1]);
	yScale.domain([d3.min(data, yValue)-0.1, d3.max(data, yValue)+0.1]);
	xScale2.domain(data.map(function(d) {return d.dept_name;}));
	
	console.log(data);

	svg.append("rect")
		.attr("class", "clicker")
		.attr("width", width)
		.attr("height", height);

	svg.append("g")
		.attr("class", "x2 axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Capacity (%)");

	svg.append("g")
		.attr("class", "x3 axis")
		.style("opacity", 0)
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Function");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Utilization (%)")

	svg.append("line")
		.attr("class", "h line")
		.attr("x1", xScale(d3.mean(data, xValue)))
		.attr("y1", yScale(d3.min(data, yValue)-0.1))
		.attr("x2", xScale(d3.mean(data, xValue)))
		.attr("y2", yScale(d3.max(data, yValue)+0.1));

	svg.append("line")
		.attr("class", "v line")
		.attr("x1", xScale(d3.min(data, xValue)-0.1))
		.attr("y1", yScale(0.75))
		.attr("x2", xScale(d3.max(data, xValue)+0.1))
		.attr("y2", yScale(0.75));

	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", function(d) {return d.dept_name.replace(/\s+/g, '') + " " + d.location_id + " dot";})
		.attr("r", 8)
		.attr("cx", 0)
		.attr("cy", height)
		.style("fill", function(d) {return color(cValue(d));})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 1);
			tooltip.html(d.employee)
				.style("left", (d3.mouse(this)[0] + 280) + "px")
				.style("top", (d3.mouse(this)[1] + 36) + "px");

		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		});

	d3.selectAll(".dot").transition()
		.delay(400).duration(800)
		.attr("cx", xMap)
		.attr("cy", yMap);

	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", function(d, i) {" legend";})
		.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color)
		.attr("class", "legend2")
		.attr("id", function(d) {return d.replace(/\s+/g, '');});

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) {return d;})
		.attr("class", "legend2")
		.attr("id", function(d) {return d.replace(/\s+/g, '')});

	d3.selectAll(".legend2").on("click", function() {
		var selection = this.id;

		d3.selectAll(".dot").attr("class", function(d) {return d.dept_name.replace(/\s+/g, '') + " " + d.location_id + " dot" + " faded";});
		d3.selectAll("circle." + selection).attr("class", function(d) {return d.dept_name.replace(/\s+/g, '') + " " + d.location_id + " dot";});

	});

	d3.select(".clicker").on("click", function() {
		d3.selectAll(".dot").attr("class", function(d) {return d.dept_name.replace(/\s+/g, '') + " " + d.location_id + " dot";});
	});

	d3.select(".xaxisoption").on("change", function() {
		var sel = this.options[this.selectedIndex].value;

		if(sel==="function") {
		 
			d3.select(".x2.axis").transition()
				.duration(500)
				.style("opacity", 0);

			d3.select(".x3.axis").transition()
				.duration(500)
				.style("opacity", 1);

			d3.selectAll(".h.line").transition()
				.duration(500)
				.style("opacity", 0);

			d3.selectAll(".dot").transition()
				.duration(800)
				.attr("cx", function(d) {return xScale2(d.dept_name);})
			//	.style("opacity", 0.9);
		}

		if(sel==="capacity") {
			d3.selectAll(".dot").transition()
				.duration(800)
				.attr("cx", xMap);

			d3.select(".x2.axis").transition()
				.duration(500)
				.style("opacity", 1);

			d3.select(".x3.axis").transition()
				.duration(500)
				.style("opacity", 0);

			d3.selectAll(".h.line").transition()
				.duration(500)
				.style("opacity", 1);
		}

	});

	d3.select("select.location").on("change", function() {
		var sel = this.options[this.selectedIndex].value;

		if(sel === "all") {
			d3.selectAll(".dot").transition()
				.duration(500)
				.attr("cy", yMap);
		}
		
		if(sel === "newyork") {
			d3.selectAll(".dot.ny").transition()
				.duration(500)
				.attr("cy", yMap);

			d3.selectAll(".dot.sf").transition()
			//	.duration(500)
				.duration(function(d, i) {return i*100;})
				.attr("cy", yScale(-1));

		}

		if(sel === "sanfrancisco") {

			d3.selectAll(".dot.sf").transition()
				.duration(500)
				.attr("cy", yMap);
			
			d3.selectAll(".dot.ny").transition()
			//	.duration(500)
				.duration(function(d, i) {return i*100;})
				.attr("cy", yScale(-1));
		}
	});

});
