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
function defineAxes(svg, xScale, xAxis, xAxisSel, yScale, yAxis, yAxisSel, chartWidth, chartHeight, chartMargin) {

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

    // add y-axis label
    // yAxisLabelOffset_vert = 0; //chartMargin.left / 2;
    // yAxisLabelOffset_hor = 0; //chartHeight / 2;
    // // svg.append("text")
    // // .text("Millions of Gallons per Day")
    // //     // .attr("transform", "translate(" + yAxisLabelOffset_hor + "," + yAxisLabelOffset_vert + ")")
    // //     .attr("transform", "rotate(-90)")
    // //     .attr("dy", "1em")
    // //     .style("text-anchor", "middle");

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
function addBars(svg, sourceData, xScale, chartHeight, yScale, total_usage) {

    bars = svg.selectAll(".bar")
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

    var formatNumber = d3.format(",.2f"),
        format = function(d) {
            return formatNumber(d);
        };

    // hover title text for individual bars
    bars.append("title")
        .text(function(d) {
            return d.label + "\n" + format(d.value) + " Million Galllons per Day" +
                "\nPercent of Total Water Use for This County: " + format((d.value / total_usage) * 100);
        });

    // values are also displayed on top of bars
    svg.selectAll("text")
        .data(sourceData)
        .enter()
        .append("text")
        .attr("id", "barValues")
        // .attr("class", "hidden")
        .text(function(d) {
            return format(d.value);
        })
        .attr("x", function(d, i) {
            return xScale(d.label) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
            return yScale(d.value) - 5;
        })
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        // .attr("font-size", "14px")
        .attr("fill", "black");

}

// Draw axes on graph
function drawAxes(xAxis, xAxisSel, yAxis, yAxisSel) {
    xAxisSel.call(xAxis);
    yAxisSel.call(yAxis);

}
