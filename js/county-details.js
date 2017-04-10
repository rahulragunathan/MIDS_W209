var countyData_filePath = "data/county.json";

var selectedCounty = "26065";

// Define SVG chart size

// Surface - Groundwater
var sg_chartMargin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};
sg_chartWidth = 300 - sg_chartMargin.left - sg_chartMargin.right;
sg_chartHeight = 400 - sg_chartMargin.top - sg_chartMargin.bottom;

var sg_svg, sg_xScale, sg_yScale, sg_xAxis, sg_xAxisSel, sg_yAxis, sg_yAxisSel;

// Freshwater - Salinated
var fs_chartMargin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};
fs_chartWidth = 300 - fs_chartMargin.left - fs_chartMargin.right;
fs_chartHeight = 400 - fs_chartMargin.top - fs_chartMargin.bottom;

var fs_svg, fs_xScale, fs_yScale, fs_xAxis, fs_xAxisSel, fs_yAxis, fs_yAxisSel;

// Industrial
var ind_chartMargin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};
ind_chartWidth = 500 - ind_chartMargin.left - ind_chartMargin.right;
ind_chartHeight = 400 - ind_chartMargin.top - ind_chartMargin.bottom;

var ind_svg, ind_xScale, ind_yScale, ind_xAxis, ind_xAxisSel, ind_yAxis, ind_yAxisSel;

// Add SVG

sg_svg = addSVG("body", "sg_svg", sg_chartWidth, sg_chartHeight, sg_chartMargin);
fs_svg = addSVG("body", "fs_svg", fs_chartWidth, fs_chartHeight, fs_chartMargin);
ind_svg = addSVG("body", "ind_svg", ind_chartWidth, ind_chartHeight, ind_chartMargin);

// Define the Axes

sg_Axes = defineAxes(sg_svg, sg_xScale, sg_xAxis, sg_xAxisSel, sg_yScale, sg_yAxis, sg_yAxisSel, sg_chartWidth, sg_chartHeight);
sg_xScale = sg_Axes.xScale, sg_xAxis = sg_Axes.xAxis, sg_xAxisSel = sg_Axes.xAxisSel;
sg_yScale = sg_Axes.yScale, sg_yAxis = sg_Axes.yAxis, sg_yAxisSel = sg_Axes.yAxisSel;

fs_Axes = defineAxes(fs_svg, fs_xScale, fs_xAxis, fs_xAxisSel, fs_yScale, fs_yAxis, fs_yAxisSel, fs_chartWidth, fs_chartHeight);
fs_xScale = fs_Axes.xScale, fs_xAxis = fs_Axes.xAxis, fs_xAxisSel = fs_Axes.xAxisSel;
fs_yScale = fs_Axes.yScale, fs_yAxis = fs_Axes.yAxis, fs_yAxisSel = fs_Axes.yAxisSel;

ind_Axes = defineAxes(ind_svg, ind_xScale, ind_xAxis, ind_xAxisSel, ind_yScale, ind_yAxis, ind_yAxisSel, ind_chartWidth, ind_chartHeight);
ind_xScale = ind_Axes.xScale, ind_xAxis = ind_Axes.xAxis, ind_xAxisSel = ind_Axes.xAxisSel;
ind_yScale = ind_Axes.yScale, ind_yAxis = ind_Axes.yAxis, ind_yAxisSel = ind_Axes.yAxisSel;

// Load the Data
d3.json(countyData_filePath, function(error, data) {

    sg_sourceData = data[selectedCounty].water_source;
    fs_sourceData = data[selectedCounty].water_type;
    ind_sourceData = data[selectedCounty].industry;

    console.log(sg_sourceData);
    console.log(fs_sourceData);
    console.log(ind_sourceData);

    // Set domains for axes
    setDomain(sg_sourceData, sg_xScale, sg_yScale);
    setDomain(fs_sourceData, fs_xScale, fs_yScale);
    setDomain(ind_sourceData, ind_xScale, ind_yScale);

    // Add bars to graph
    addBars(sg_svg, sg_sourceData, sg_xScale, sg_chartHeight, sg_yScale);
    addBars(fs_svg, fs_sourceData, fs_xScale, fs_chartHeight, fs_yScale);
    addBars(ind_svg, ind_sourceData, ind_xScale, ind_chartHeight, ind_yScale);

    // Draw axes on graph
    drawAxes(sg_xAxis, sg_xAxisSel, sg_yAxis, sg_yAxisSel);
    drawAxes(fs_xAxis, fs_xAxisSel, fs_yAxis, fs_yAxisSel);
    drawAxes(ind_xAxis, ind_xAxisSel, ind_yAxis, ind_yAxisSel);

});
