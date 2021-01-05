var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Append a div to the body to create tooltips, assign it a class
d3.select(".scatter").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file 
d3.csv("assets/data/data.csv", function(err, data) {
    if (err) throw err;

    data.forEach(function(item){
        item.poverty = +item.poverty;
        item.smokes = +item.smokes;

    });

    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    xLinearScale.domain([7,d3.max(data, function(item){
        return +item.smokes;
    }),
]);
yLinearScale.domain([0,d3.max(data, function(item){
    return +item.smokes;
    }),
]);

var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(item) {
        var stateName = item.state;
        var pover = +item.poverty;
        var smoke = +item.smokes;
        return(stateName + "<b> Poverty(%): "+pover+"<b> Smoker Age(Median)"+smoke);
    });
    chartGroup.call(toolTip);

    chartGroup
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(data, index){
            return xLinearScale(data.poverty);
        })
        .attr("cy", function(data, index){
            return yLinearScale(data.smokes);
        })
        .attr("r", 20)
        .attr("stroke", "black")
        .attr("opacity", "0.75")
        .attr("fill", "salmon")
        .on("mouseover", function(item){
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data, this)
        });

    chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
        
    chartGroup.append("g").call(leftAxis);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("text")
        .text(function(item) {
            return item.abbr;})
        .attr("x", function(item) {
            return xLinearScale(item.poverty);
        })
        .attr("y", function(item) {
            return yLinearScale(item.smokes);
        })
        .attr("font-size", "10px")
        .attr("fill", "blue")
        .style("text-anchor", "middle");
    
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Median Age of Smokers");
    
    chartGroup
        .append("text")
        .attr("transform", "translate(" + width/2 + " , " + (height + margin.top + 30) + ")",)
        .attr("class", "axisText")
        .text("In Poverty (%)");

});



