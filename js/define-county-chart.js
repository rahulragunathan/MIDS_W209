var yScaleFactor = 1.1;

// Add SVG

function addSVG(svg_div, svg_id, chartWidth, chartHeight, chartMargin) {

    svg = d3.select(svg_div)
        .append("svg")
        .attr("id", svg_id)
        .attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + chartMargin.left + "," + chartMargin.top + ")");

    return svg;

}

// Define the Axes

function defineAxes(svg, xScale, xAxis, xAxisSel, yScale, yAxis, yAxisSel, chartWidth, chartHeight) {

    xScale = d3.scale
        .ordinal()
        .rangeRoundBands([0, chartWidth], 0.05);
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    xAxisSel = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartHeight + ")");

    yScale = d3.scale
        .linear()
        .range([chartHeight, 0]);
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);
    yAxisSel = svg.append("g")
        .attr("class", "y axis");

    return {
        xScale: xScale,
        xAxis: xAxis,
        xAxisSel: xAxisSel,
        yScale: yScale,
        yAxis: yAxis,
        yAxisSel: yAxisSel
    };

}

// Set domains for axes
function setDomain(sourceData, xScale, yScale) {
    xScale.domain(sourceData.map(function(d) {
        return d.label;
    }));
    yScale.domain([0, yScaleFactor * d3.max(sourceData, function(d) {
        return d.value;
    })]);
}

// Add bars to graph
function addBars(svg, sourceData, xScale, chartHeight, yScale) {
    svg.selectAll("rect")
        .data(sourceData)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xScale(d.label);
        })
        .attr("y", function(d) {
            return chartHeight - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
            return yScale(d.value);
        });
}

// Draw axes on graph
function drawAxes(xAxis, xAxisSel, yAxis, yAxisSel) {
    xAxisSel.call(xAxis);
    yAxisSel.call(yAxis);
}
