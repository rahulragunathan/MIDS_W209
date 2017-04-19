var state_summary_data;
var selected_statistic;
var stat_per_capita;
var state_fips;
var county_fips;
var current_county_name;

d3.csv("data/state_2010_limited.csv", function(data) {
    state_summary_data = data;
});

function update_all() {

    update_statistic();
    graph_force_directed();
    draw_state_map();
    draw_full_map();
    set_map_view();
}

update_all();
