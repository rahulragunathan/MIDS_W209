function draw_legend() {

	selected_statistic = document.querySelector('input[name="filter"]:checked').value; 

	// The rectangle that will be the legend
	var w = 140, h = 300;

	
	var minimumColor = '#fff', maximumColor = '#006EB4';

	//retrieve local variables
	max_val = localStorage.getItem("selected_max_val");
	min_val = localStorage.getItem("selected_min_val");

	max_val = selected_max_val;
	min_val = selected_min_val;

	// Minimum data values
	var minimum = min_val, maximum = max_val;

	var minimum = 5, maximum = 500;

	//The maximum and minimum color
	var minimumColor = '#fff', maximumColor = '#006EB4';

	// Define the color range
	var color = d3.scale.linear().domain([minimum, maximum]).range([minimumColor, maximumColor]);


	var key = d3.select("body")
		.append("svg")
		.attr("id", "key")
		.attr("width", w)
		.attr("height", h);
	
	var legend = key.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "100%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

	legend.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", maximumColor)
		.attr("stop-opacity", 1);

	legend.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", minimumColor)
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("width", w - 100)
		.attr("height", h - 100)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0,10)");
	
	var y = d3.scale.linear()
		.range([200, 0])
		.domain([minimum, maximum]);

	var yAxis = d3.svg.axis()
			.scale(y)
			.orient("right");

	key.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(42,10)")
		.call(yAxis).append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 30).attr("dy", ".71em")
		.style("text-anchor", "end")
		//.text("Requested Water Attribute, MGD");
		.text(selected_statistic);
}
