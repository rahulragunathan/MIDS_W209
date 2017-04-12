function draw_state_map(){
	//remove previous call of map
	d3.select('#state_map_svg').remove();
	
	var margin = { top: 50, bottom: 50, right: 0, left: 0 };
  	var width = 500 - margin.right - margin.left;
  	var height = 400;
	

  	var map;
	d3.select(".state_map_full")
		.style("width", width +"px");
		//.style("height", height + "px");
	d3.select("#state_map")
		.style("width", width +"px")
		.style("height", height + "px");


	var q = queue()
    		.defer(d3.json, "data/geo_county.json")
    		.defer(d3.json, "data/geo_state.json")
    		.await(state_county_selection);

	var state_selection = " ";
	
	function state_county_selection(error, county, state) {
    		if (error) throw error;
			// filter json file by state selection (fips code)
			state.features = state.features.filter(function (row) {
  				if (row.id === state_fips){return row};});

			county.features = county.features.filter(function (row) {
			  if (row.id.slice(0,2) === state_fips){return row};});

    		var stateIds = {};
    		state.features.forEach(function(d) {
				stateIds[d.id] = d.properties.name;
    		});
			var selected_statistic_array = new Array();

    		county.features.forEach(function(d) {
        		d.properties.state = stateIds[d.id.slice(0,2)];
				selected_statistic_array.push(d.properties[selected_statistic])
    		})

    		// remove the loading text
    		d3.select('.loading').remove();

    		map = d3.select('#state_map').append('svg')
        		.attr('width', width)
        		.attr('height', height)
				.attr("id", "state_map_svg");
			var state_center = d3.geo.centroid(county)
			
			
			var merc_scale = width *3.3;
			var state_offset = [width/2, height/2];
			var projection = d3.geo.mercator()
				.scale(merc_scale)
				.center(state_center)
				.translate(state_offset);
			var path = d3.geo.path().projection(projection);
		
		  var bounds  = path.bounds(county);
		  var hscale  = merc_scale*width  / (bounds[1][0] - bounds[0][0]);
		  var vscale  = merc_scale*height / (bounds[1][1] - bounds[0][1]);
		  var merc_scale   = (hscale < vscale) ? hscale : vscale;
		  var state_offset  = [width - (bounds[0][0] + bounds[1][0])/2,
							height - (bounds[0][1] + bounds[1][1])/2];
    		
			var projection = d3.geo.mercator()
				.scale(merc_scale)
				.center(state_center)
				.translate(state_offset);
			var path = d3.geo.path().projection(projection);
		
			var max_val = d3.max(selected_statistic_array)
			var min_val = d3.min(selected_statistic_array)
		
			var color = d3.scale.linear()
		  .domain([min_val, max_val])
		  .clamp(true)
		  .range(['#fff', '#409A99']);
		
			var counties = map.append('g')
        		.attr('class', 'counties')
      			.selectAll('path')
        		.data(county.features)
      			.enter().append('path')
        		.attr('d', path);
			counties
				.style("fill", function(d){
				return color(d.properties[selected_statistic])
			})

    		counties.on('mouseover', showCaption)
        		.on('mousemove', showCaption)
        		.on('mouseout', function() {
            		caption.html(starter);
					d3.select('#tooltip_state_map').classed('hidden', true);
        	})
				.on('click', function(d){
					county_fips = d.id;
					draw_county_charts();
					display_sankey();
					d3.select('.counties_selected')
					.classed('counties_selected', false);
					d3.select(this)
					.classed('counties_selected', true);
					d3.select('#county_header').text(d.properties.name)

				
			});

    		var states = map.append('g')
        		.attr('class', 'states')
      			.selectAll('path')
        		.data(state.features)
      			.enter().append('path')
        		.attr('d', path);
    		var caption = d3.select('#caption')
      			, starter = caption.html();

    		function showCaption(d, i) {
        		var name = [d.properties.name, d.properties.state].join(', ');
			state_selection = d.properties.state;
				d3.select("#county_hover").text(name);
				d3.select("#county_hover_stat").text(d.properties[selected_statistic])
			console.log(state_selection);
        		caption.html(name);
				d3.select('#tooltip_state_map').classed('hidden', false);
    		}

		console.log(state_selection);
}}