var countyData_filePath = "data/county.json";

var selectedCounty = "26065";

// Surface - Groundwater chart
// Define SVG chart size
var sg_chartMargin = {
    top: 5,
    right: 10,
    bottom: 5,
    left: 10
};
sg_chartWidth = 200 - sg_chartMargin.left - sg_chartMargin.right;
sg_chartHeight = 100 - sg_chartMargin.top - sg_chartMargin.bottom;

var sg_svg, sg_xScale, sg_yScale, sg_xAxis, sg_xAxisSel, sg_yAxis, sg_yAxisSel;

var sg_svg = d3.select("body")
    .append("svg")
    .attr("id", "sg_svg")
    .attr("width", sg_chartWidth + sg_chartMargin.left + sg_chartMargin.right)
    .attr("height", sg_chartHeight + sg_chartMargin.top + sg_chartMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + sg_chartMargin.left + "," + sg_chartMargin.top + ")");

// define the axes
// x
sg_xScale = d3.scale.ordinal().rangeRoundBands([0, sg_chartWidth], 0.05);
sg_xAxis = d3.svg.axis()
    .scale(sg_xScale)
    .orient("bottom");
sg_xAxisSel = sg_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + sg_chartHeight + ")");

// y
sg_yScale = d3.scale.linear().range([sg_chartHeight, 0]);
sg_yAxis = d3.svg.axis()
    .scale(sg_yScale)
    .orient("left")
    .ticks(10);
sg_yAxisSel = sg_svg.append("g").attr("class", "y axis");

// load the data
d3.json(countyData_filePath, function(error, data) {

    // define arrays to hold data
    var sg_chartData = [];
    var sg_chartLabels = [];
    var fs_chartData = [];
    var fs_chartLabels = [];

    sg_sourceData = data[selectedCounty].water_source;

    for (var i = 0; i < sg_sourceData.length; i++) {
        sg_chartLabels.push(sg_sourceData[i].label);
        sg_chartData.push(sg_sourceData[i].value);
    }

    ind_sourceData = data[selectedCounty].water_type;

    console.log(sg_chartData);

    // Determine domains for axes
    sg_xScale.domain(d3.range(sg_chartLabels))
        .rangeRoundBands([0, sg_chartWidth], 0.05);

    sg_yScale.domain([0, d3.max(sg_chartData)]);

    // Add bars to graph
    sg_svg.selectAll("rect")
        .data(sg_chartData)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return sg_xScale(i);
        })
        .attr("y", function(d) {
            return sg_chartHeight - sg_yScale(d); //Height minus data value
        })
        .attr("width", sg_xScale.rangeBand())
        .attr("height", function(d) {
            return sg_yScale(d);
        });

    // Draw axes on graph
    sg_xAxisSel.call(sg_xAxis);
    sg_yAxisSel.call(sg_yAxis);

});
