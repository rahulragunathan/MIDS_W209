var countyData_filePath = "data/county.json";

var selectedCounty = "26065";
var yScaleFactor = 1.1;

// Surface - Groundwater chart
// Define SVG chart size
var sg_chartMargin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};
sg_chartWidth = 200 - sg_chartMargin.left - sg_chartMargin.right;
sg_chartHeight = 200 - sg_chartMargin.top - sg_chartMargin.bottom;

var sg_svg, sg_xScale, sg_yScale, sg_xAxis, sg_xAxisSel, sg_yAxis, sg_yAxisSel;

sg_svg = d3.select("body")
    .append("svg")
    .attr("id", "sg_svg")
    .attr("width", sg_chartWidth + sg_chartMargin.left + sg_chartMargin.right)
    .attr("height", sg_chartHeight + sg_chartMargin.top + sg_chartMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + sg_chartMargin.left + "," + sg_chartMargin.top + ")");

// define the axes
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

    sg_sourceData = data[selectedCounty].water_source;
    fs_sourceData = data[selectedCounty].water_type;
    ind_sourceData = data[selectedCounty].industry;

    console.log(sg_sourceData);
    console.log(fs_sourceData);
    console.log(ind_sourceData);

    // Determine domains for axes
    sg_xScale.domain(d3.range(sg_sourceData.length));
    sg_yScale.domain([0, yScaleFactor * d3.max(sg_sourceData, function(d) {
        return d.value;
    })]);

    // Add bars to graphs
    sg_svg.selectAll("rect")
        .data(sg_sourceData)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return sg_xScale(i);
        })
        .attr("y", function(d) {
            console.log(sg_yScale(d.value));
            return sg_chartHeight - sg_yScale(d.value); //Height minus data value
        })
        .attr("width", sg_xScale.rangeBand())
        .attr("height", function(d) {
            console.log(sg_yScale(d.value));
            return sg_yScale(d.value);
        });

    // Draw axes on graph
    sg_xAxisSel.call(sg_xAxis);
    sg_yAxisSel.call(sg_yAxis);

});
