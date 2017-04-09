var width = 400,
    height = 300,
    centered,
    sqWidth = 12;

//height and width for hover box
var tool_bubbles_w = 350;
var tool_bubbles_h = 250;
d3.select("#tooltip_bubbles")
	.attr("width", tool_bubbles_w +"px")
	.attr("height", tool_bubbles_h +"px");
//format value in hover box
d3.selectAll('#selected_statistic').text(selected_statistic);
var formatCount = d3.format(",.2f");

var projection = d3.geo.mercator()
  .scale(350)
  // Center the Map in USA
  .center([ -95, 37 ])
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Set svg width & height
var svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

// Add background
svg.append('rect')
  .attr('class', 'background')
  .attr('width', width)
  .attr('height', height);

var g = svg.append('g');

var networkLayer = g.append('g')
  .classed('network-layer', true);

var mapLayer = g.append('g')
  .classed('map-layer', true);


// Load map data
d3.json('http://eyeseast.github.io/visible-data/data/gis/us-states.json', function(error, mapData) {
	
	// Merge state water data
	// Build in ability to change statistic based on user selection
	// This will be global

	
	for (var i = 0;i < state_summary_data.length; i++){
		//Grab values from state summary data
		var state_data_fips = state_summary_data[i]['STATEFIPS']
		
		//fix fips code that got pulled in as numeric
		if (state_data_fips.length == 1){state_data_fips = "0" + state_data_fips}
		
		var state_data_value = parseFloat(state_summary_data[i][selected_statistic])
		if (stat_per_capita == 1){
			state_data_value = state_data_value / parseFloat(state_summary_data[i]['TP.TotPop'])}
		var state_data_abr = state_summary_data[i]['STATE']
		
		// find state within map file and copy in new values
		for (var j = 0; j < mapData.features.length; j++){
			var map_state = mapData.features[j].id;
			
			if (map_state == state_data_fips){
				mapData.features[j].properties.abr = state_data_abr;
				mapData.features[j].properties.value = state_data_value;
				break;
			}
		}
	}

	// Define color scale
	if (stat_per_capita == 1){
		var min_state_data = d3.min(state_summary_data, function(d){return d[selected_statistic] / parseFloat(d['TP.TotPop'])});
		var max_state_data = d3.max(state_summary_data, function(d){return d[selected_statistic] / parseFloat(d['TP.TotPop'])});} else{
				var min_state_data = d3.min(state_summary_data, function(d){return d[selected_statistic]});
				var max_state_data = d3.max(state_summary_data, function(d){return d[selected_statistic]});
		};


	var color = d3.scale.linear()
	  .domain([min_state_data, max_state_data])
	  .clamp(true)
	  .range(['#fff', '#409A99']);
	
  var links =[];
  var features = mapData.features;
  features.forEach(function (d) {
    d.size = sqWidth;
    d.x = path.centroid(d)[0];
    d.y = path.centroid(d)[1];
    d.feature = d;
  });


  d3.geom.voronoi().links(features).forEach(function(link) {
    var dx = link.source.x - link.target.x,
        dy = link.source.y - link.target.y;
    link.distance = Math.sqrt(dx * dx + dy * dy);
    links.push(link);
  });

  // Update color scale domain based on data
  //color.domain([0, d3.max(features.filter(function (d) {
 //   return d.properties.DPTO!=="88"; //Archipiélago de San Andres... is too long, ignoring it so the colors aren't too skewed.
 // }), nameLength)]);

  var force = d3.layout.force()
    .nodes(features)
    // .links(links)
    .size([width, height])
    .gravity(0.01)
    // .linkStrength(0.05)
    // .linkDistance(function(d) { return d.distance; })
    .on("tick", onTick)
    .start();

  // Draw each depto as a path
  mapLayer.selectAll('path')
      .data(features)
    .enter().append('path')
      .attr('d', path)
     .attr('vector-effect', 'non-scaling-stroke');
      //.style('fill', fillFn);

// var link = networkLayer.selectAll("line")
//       .data(links)
//     .enter().append("line")
//       .attr("class", "link")
//       .attr("x1", function(d) { return d.source.x; })
//       .attr("y1", function(d) { return d.source.y; })
//       .attr("x2", function(d) { return d.target.x; })
//       .attr("y2", function(d) { return d.target.y; });

  var selEnter = networkLayer.selectAll('.depto')
      .data(features)
    .enter().append('g')
      .attr("class", "depto");
	function fillFn(d){
	  //return color(nameLength(d));
		return color(d.properties.value);
	  // return color(nameFn(d));
	}
  selEnter
      // .append("rect")
      .append("circle")
      .attr('r', sqWidth)
      // .attr('width', sqWidth)
      // .attr('height', sqWidth)
      .style('fill', fillFn)
      .call(force.drag);

  selEnter.append("text")
     //.attr('x', sqWidth/2)
     //.attr('y', sqWidth/2)
    .style("text-anchor", "middle")
    //.text(function (d) {return d.id });
	.text(function (d) {return d.properties.abr });
	
	selEnter
		//call histogram on hover of each dot
	.on("mouseover", function(d){
		//var xPosition = parseFloat(d3.select(this).attr("cx")) + 20;
		//var yPosition = parseFloat(d3.select(this).attr("cy"));
		d3.select("#tooltip_bubbles")
		//	.style("left", xPosition +"px")
		//	.style("top", yPosition +"px")
			.style("left", 200 +"px")
			.style("top", 300 +"px")
		  .selectAll("#bubble_name")
  			.text(d.properties.name);
		d3.select("#tooltip_bubbles")
		  .select("#bubble_value")
  			.text(formatCount(d.properties.value));
		d3.select("#tooltip_bubbles").classed("hidden", false);})
	.on("mouseout",function(){	
		d3.select("#tooltip_bubbles").classed("hidden", true);});
		


  function onTick(e) {
    var k = e.alpha * 0.2,
      q = d3.geom.quadtree(features);

    features.forEach(function (o) {
      o.x += (path.centroid(o)[0] - o.px) * k;
      o.y += (path.centroid(o)[1] - o.py) * k;
      q.visit(sqCollide(o));
    });

    // link.attr("x1", function(d) { return d.source.x; })
    //     .attr("y1", function(d) { return d.source.y; })
    //     .attr("x2", function(d) { return d.target.x; })
    //     .attr("y2", function(d) { return d.target.y; });

    networkLayer.selectAll('.depto')
      .attr("transform", function (d) {
          // return "translate(" + (d.x - sqWidth/2) + "," + (d.y - sqWidth/2) + ")";
          return "translate(" + (d.x) + "," + (d.y) + ")";
      });
  }

});


//Approx collide function for squares
function sqCollide(node) {
  var s = node.size,
  nx1 = node.x - s,
  nx2 = node.x + s,
  ny1 = node.y - s,
  ny2 = node.y + s;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
      y = node.y - quad.point.y,
      l = Math.sqrt(x * x + y * y),
      s = node.size + quad.point.size;
      if (l < s) {
        l = (l - s) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

// Get depto name
function nameFn(d){
  return d && d.features ? d.features.id : null;
}

// Get depto name length
function nameLength(d){
  var n = nameFn(d);
  return n ? n.length : 0;
}

// Get depto color


