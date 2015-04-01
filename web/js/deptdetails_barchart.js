d3.select("body").append("div").attr("class", "popup");
d3.select("body").append("div").attr("class", "invisible");
d3.select(".content").transition().duration(250).style("opacity", 0.2);

d3.select(".popup").append("div").attr("class", "close");
//d3.select(".popup").append("div").attr("class", "nav");
d3.select(".popup").append("div").attr("class", "content2").style("float", "center").style("width", 1100);


//close pop-up via close button, pressing ESC and clicking outside the div
d3.select(".close").on("click", function() {
	d3.select(".popup").remove();
	d3.select(".content").style("opacity", 1);
});

d3.select(".invisible").on("click", function() {
	d3.select(".popup").remove();
	d3.select(".invisible").remove();
	d3.select(".content").style("opacity", 1);
});

d3.select("body").on("keydown", function() {
	var keycode = d3.event.keyCode;
	if(keycode === 27) {
		d3.select(".popup").remove();
		d3.select(".content").style("opacity", 1);
	}
});

var data = [];

var employee = [],
	utilization = [],
	capacity = [];


d3.selectAll("td.employee").each(function(d, i) {employee.push(d3.select(this).property("textContent"));});
d3.selectAll("td.utlz").each(function(d) {utilization.push(parseFloat(d3.select(this).property("textContent")));});
d3.selectAll("td.cap").each(function(d) {capacity.push(parseFloat(d3.select(this).property("textContent")));});


for(i=0; i<employee.length; i++) {
	var newObj = {employee: employee[i], utilization: utilization[i], capacity: capacity[i]};
	
	data.push(newObj);	
}

data.sort(function(a, b) {return b.utilization - a.utilization;});

var margin = {top: 20, right: 20, bottom: 40, left: 75},
	width = 1100 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");
	
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10).tickFormat(formatPercent);

var svg = d3.select(".content2").append("svg")
	.attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
x.domain(data.map(function(d) {return d.employee;}));
y.domain([0, d3.max(data, function(d) {return d.utilization/100 + 0.5;})]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .style("font-size", function(d, i) {
	  
	  if(data.length > 15) {
		  return "8px";
	  }else{
		  return "10px";
	  }
  })
  .call(xAxis)
  .selectAll(".tick text")
  .call(wrap, x.rangeBand())


svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Utilization");


svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("client", function(d) {return d.employee;})
      .attr("id", function(d, i) {return i;})
	  .attr("x", function(d) {return x(d.employee);})	
	  .attr("width", x.rangeBand())
	  .attr("y", 440)
	  .attr("height", 0)
      .style("fill", "steelblue")
      .on("mouseover", function() {
	      d3.select(this).style("fill", "#990000");
      })
      .on("mouseout", function() {
	      d3.select(this).style("fill", "steelblue");
      });
      
svg.selectAll(".txt_label")
		.data(data)
	.enter().append("text")
	.attr("class", "txt_label")
	.attr("x", function(d) {return x(d.employee) + (width/data.length/2);})
	.attr("y", function(d) {return y(d.utilization/100) - 5;})
	.text(function(d) {return d.utilization + "%";})
	.style("text-anchor", "middle")
	.style("opacity", 0);

svg.append("line")
	.attr("class", "v line")
	.attr("x1", 0)
	.attr("y1", y(0.75))
	.attr("x2", width)
	.attr("y2", y(0.75));
	
d3.selectAll(".bar").transition()
	.attr("height", function(d) {return height-y(d.utilization/100);})
	.attr("y", function(d) {return y(d.utilization/100);})
	.delay(function(d, i) {return i*45;})
	.duration(540);

d3.selectAll(".txt_label").transition()
	.style("opacity", 1).delay(data.length*60).duration(400);
      
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
