var current_window = "national_county";

function set_map_view() {

    if (current_window == "national_county") {
        d3.select("#switch_graphs").text("View State-Level USA Map");
        d3.select("#map_full_div").classed("hidden", false);
        d3.select("#force_directed_div").classed("hidden", true);
    } else if (current_window == "state_aggr") {
        d3.select("#switch_graphs").text("View County-Level USA Map");
        d3.select("#map_full_div").classed("hidden", true);
        d3.select("#force_directed_div").classed("hidden", false);
    }
}

function switch_map_view() {
    if (current_window == "national_county") {
        current_window = "state_aggr";
    } else if (current_window == "state_aggr") {
        current_window = "national_county";
    }
    set_map_view();
}

function closeNavClick(div_id) {
    d3.select(div_id).classed('hidden', true);
}
