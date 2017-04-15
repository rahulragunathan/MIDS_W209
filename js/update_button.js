var current_window = "full_map";
function update_button(){

	if (current_window === "county_details_map_full"){
			d3.select("#switch_graphs").text("Back to USA Map");
			d3.select("#switch_graphs").on("click", function(){
				d3.select("#map_full_div").classed("hidden", false);
				d3.select("#force_directed_div").classed("hidden", true);
				d3.select("#map_state_div").classed("hidden", true);
				d3.select("#county_details_div").classed('hidden', true);
			});
		} else if (current_window === "county_details_map_state"){
			d3.select("#switch_graphs").text("Back to State Map");
			d3.select("#switch_graphs").on("click", function(){
				d3.select("#map_full_div").classed("hidden", true);
				d3.select("#force_directed_div").classed("hidden", true);
				d3.select("#map_state_div").classed("hidden", false);
				d3.select("#county_details_div").classed('hidden', true);
			});
		} else if (current_window === "map_state"){
			d3.select("#switch_graphs").text("Back to State-Level USA Map");
			d3.select("#switch_graphs").on("click", function(){
				d3.select("#map_full_div").classed("hidden", true);
				d3.select("#force_directed_div").classed("hidden", false);
				d3.select("#map_state_div").classed("hidden", true);
				d3.select("#county_details_div").classed('hidden', true);
			});
		} else if (current_window === "force_directed"){
			d3.select("#switch_graphs").text("View County-Level USA Map");
			d3.select("#switch_graphs").on("click", function(){
				d3.select("#map_full_div").classed("hidden", false);
				d3.select("#force_directed_div").classed("hidden", true);
				d3.select("#map_state_div").classed("hidden", true)
				d3.select("#county_details_div").classed('hidden', true);
			});
		} else if (current_window === "full_map"){
			d3.select("#switch_graphs").text("Aggregate Data by State");
			d3.select("#switch_graphs").on("click", function(){
				d3.select("#map_full_div").classed("hidden", true);
				d3.select("#force_directed_div").classed("hidden", false );
				d3.select("#map_state_div").classed("hidden", true)
				d3.select("#county_details_div").classed('hidden', true);
			});
			
		} 
	
	
	
};