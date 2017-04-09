function update_statistic(){
	selected_statistic = document.querySelector('input[name="filter"]:checked').value;
	if (document.getElementById("percap_check").checked === false){
		stat_per_capita = 0;
		d3.select("#stat_per_capita").classed("hidden", true);
	} else{
		stat_per_capita = 1;
		d3.select("#stat_per_capita").classed("hidden", false);
	}
};
