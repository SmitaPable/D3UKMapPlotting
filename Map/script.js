// Container
    var width = 800;
    var height = 600;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
//Projection of map
    var projection = d3.geoMercator()
        .center([-10, 54])
        .scale(2000)
        .translate([width/2, height/2]);

    var path = d3.geoPath()
        .projection(projection);
// Loading the map json
    d3.json("maps.json").then(function(uk) {
        console.log(uk);
        svg.selectAll("path")
            .data(uk.features)
            .enter()
            .append("path")
            .attr("d", path);
    });


    
    function plotTowns(data, townCount) {
// remove existing circles
        svg.selectAll(".town").remove();
    
        
        const filteredData = data.slice(0, townCount);
//Plotting the towns on the map        
        const townCircles = svg.selectAll(".town")
            .data(filteredData)
            .enter().append("circle")
            .attr("class", "town")
            .attr("cx", function(d) { return projection([d.lng, d.lat])[0]; })
            .attr("cy", function(d) { return projection([d.lng, d.lat])[1]; })
            .attr("r", d => Math.sqrt(d.Population) / 40)
            .attr("fill", "steelblue")
            .attr("opacity", 0.9);
            townCircles.on("mouseover", function(d) {
                // Show town name on hover
                const tooltip = d3.select("#customTooltip");
                tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
            tooltip.html(`Town: ${d.Town}<br>Population: ${d.Population}<br>County: ${d.County}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                // Hide tooltip on mouseout
                const tooltip = d3.select("#customTooltip");
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });
        // Apply animations to the new towns
    townCircles.transition()
    .duration(500)
    .attr("r", d => Math.sqrt(d.Population) / 40);

// Show town details on click
townCircles.on("click", function (d) {
    alert(`Town: ${d.Town}\nPopulation: ${d.Population}\nCounty: ${d.County}`);
});    
}   
    

 
// Load the town data from a JSON file
d3.json("Cities.json").then(function (townData) {
    const townCountInput = document.getElementById("townCount");
    let selectedTownCount = townCountInput.value;
    const sliderValue = document.getElementById("sliderValue");

    // Load and plot the initial set of towns
    plotTowns(townData, selectedTownCount);

    // Update the slider value display
    sliderValue.innerText = selectedTownCount;

    // Reload data and plot new set of towns when the button is clicked
    d3.select("#reloadButton").on("click", function () {
        selectedTownCount = townCountInput.value;
        plotTowns(townData, selectedTownCount);
        sliderValue.innerText = selectedTownCount;
    });

    // Update the number of towns displayed based on the slider
    townCountInput.addEventListener("input", function () {
        selectedTownCount = this.value;
        plotTowns(townData, selectedTownCount);
        sliderValue.innerText = selectedTownCount;
    });
});

// Add a tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    function reloadData() {
        location.reload();
    }