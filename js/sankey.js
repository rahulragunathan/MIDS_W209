function display_sankey() {
    var d3 = d3_v4;

    d3.select('#sankey_svg').remove();
    var sankey_margin = {
            top: 1,
            right: 1,
            bottom: 6,
            left: 1
        },
        sankey_width = 400 - sankey_margin.left - sankey_margin.right,
        sankey_height = 300 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format(",.2f"),
        format = function(d) {
            return formatNumber(d);
        },
        color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg = d3.select("#sankey_div").append("svg")
        .attr("width", sankey_width + sankey_margin.left + sankey_margin.right)
        .attr("height", sankey_height + sankey_margin.top + sankey_margin.bottom)
        .attr("id", "sankey_svg")
        .append("g")
        .attr("transform", "translate(" + sankey_margin.left + "," + sankey_margin.top + ")");

    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([sankey_width, sankey_height]);

    var path = sankey.link();

    //var county_selection = "06037"
    d3.json("data/county.json", function(water_flow) {

        sankey
            .nodes(water_flow[county_fips].nodes)
            .links(water_flow[county_fips].links)
            .layout(32);

        var total_usage = water_flow[county_fips].total_usage;

        var link = svg.append("g").selectAll(".link")
            .data(water_flow[county_fips].links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) {
                return Math.max(1, d.dy);
            })
            .sort(function(a, b) {
                return b.dy - a.dy;
            });

        link.append("title")
            .text(function(d) {
                return d.source.name + " → " + d.target.name +
                    "\n" + format(d.value) + " Million Galllons per Day" +
                    "\nPercent of Total Water Use for This County: " + format((d.value / total_usage) * 100);
            });

        var node = svg.append("g").selectAll(".node")
            .data(water_flow[county_fips].nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.drag()
                .subject(function(d) {
                    return d;
                })
                .on("start", function() {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        node.append("rect")
            .attr("height", function(d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function(d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + format(d.value) + " Million Galllons per Day" +
                    "\nPercent of Total Water Use for This County: " + format((d.value / total_usage) * 100);
            });

        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) {
                return d.name;
            })
            .filter(function(d) {
                return d.x < sankey_width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

        //	var sankey_header1 = d3.select("#sankey_header1")
        //		.style("width", (sankey_width / 2)-1 +"px")
        //		.style("height", 30 + "px")
        //		.append("svg")
        //		.style("width", (sankey_width / 2)-1 +"px")
        //		.style("height", 30 + "px");
        //	sankey_header1
        //		.append("rect")
        //		.attr("width", sankey.nodeWidth() + 1)
        //		.attr("height", 30);
        //	sankey_header1
        //		.append("text")
        //		.text("Water Source")
        //		.attr("x",sankey.nodeWidth() + 6)
        //		.attr("y",20)
        //		.attr("font-size", "16px")
        //		.attr("fill", "white");

        //	var sankey_header2 = d3.select("#sankey_header2")
        //		.style("width", (sankey_width / 2)-1 +"px")
        //		.style("height", 30 + "px")
        //		.append("svg")
        //		.style("width", (sankey_width / 2)-1 +"px")
        //		.style("height", 30 + "px");
        //	sankey_header2
        //		.append("rect")
        //		.attr("width", sankey.nodeWidth()+1)
        //		.attr("height", 30)
        //		.attr("x", (sankey_width / 2)-1 - sankey.nodeWidth());
        //	sankey_header2
        //		.append("text")
        //		.text("Water Use")
        //		.attr("x",(sankey_width / 2)-1 - sankey.nodeWidth() - 75)
        //		.attr("y",20)
        //		.attr("font-size", "16px")
        //		.attr("fill", "white");

    });
}
