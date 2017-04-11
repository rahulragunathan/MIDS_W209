var yScaleFactor = 1.1;

// Add SVG to DOM
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

// Define the axes
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
        .orient("left");
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

// Add bars to SVG
function addBars(svg, sourceData, xScale, chartHeight, yScale) {
    svg.selectAll(".bar")
        .data(sourceData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return xScale(d.label);
        })
        .attr("y", function(d) {
            return yScale(d.value);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
            return (yScale(0) - yScale(d.value));
        });
    // .on("mouseover", function(d) {
    //     svg.select("#barValues").classed("hidden", false);
    // })
    // .on("mouseout", function() {
    //     svg.select("#barValues").classed("hidden", true);
    // });

    svg.selectAll("text")
        .data(sourceData)
        .enter()
        .append("text")
        .attr("id", "barValues")
        // .attr("class", "hidden")
        .text(function(d) {
            return d.value;
        })
        .attr("x", function(d, i) {
            return xScale(d.label) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
            return yScale(d.value) - 5;
        })
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black");

}

// Draw axes on graph
function drawAxes(xAxis, xAxisSel, yAxis, yAxisSel) {
    xAxisSel.call(xAxis);
    yAxisSel.call(yAxis);
}
