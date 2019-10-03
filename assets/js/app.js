// Step 1: Set up our chart.
//= ========================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60, 
  left: 50
};

var chartwidth = svgWidth - margin.left - margin.right;
var chartheight = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =============================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the data.csv file.
// ===================================
d3.csv("assets/data/data.csv").then(function(NewsPaper) {
    
    //Step 4: Format the data and convert the selected columns to numeric from string.
    // ===============================================================================
    NewsPaper.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        // console.log(d.abbr)
    }); 
    // Step 5: Create the scales for the chart.
    // ========================================
    xlinearScale = d3.scaleLinear().domain([d3.min(NewsPaper,d=>d.poverty)-0.5, d3.max(NewsPaper,d=>d.poverty)+1]).range([0,chartwidth]);
    ylinearScale = d3.scaleLinear().domain([d3.min(NewsPaper,d=>d.healthcare)-2, d3.max(NewsPaper,d=>d.healthcare)+1]).range([chartheight,0]);
     
    // Step 6: Create the axes.
    // ========================
    var bottomAxis = d3.axisBottom(xlinearScale);
    var leftAxis   = d3.axisLeft(ylinearScale);

    // Step 7: Append the axes to the chartGroup.
    // ==========================================
    //Add x-axis
    chartGroup.append("g").attr("transform",`translate(0, ${chartheight})`).call(bottomAxis);
    //Add y-axis
    chartGroup.append("g").call(leftAxis);

    // Step 8: Initialize Tooltip.
    // ============================
    var toolTip = d3.tip()
                  .attr("class","tooltip")
                  .html(function(d){
                    return(`<strong style="font-family:Times New Roman;">State: </strong><i style="font-family:Times New Roman;">${d.state}</i><br><strong style="font-family:Times New Roman;">Poverty: </strong><i style="font-family:Times New Roman;">${d.poverty}</i><br><strong style="font-family:Times New Roman;">Healthcare: </strong><i style="font-family:Times New Roman;">${d.healthcare}</i>`)
                  });

    // Step 9: Create tooltip in the chart.
    // =====================================
    chartGroup.call(toolTip);  

    // Step 10: Add circles.
    // ====================
    chartGroup.selectAll("circle")
                      .data(NewsPaper)
                      .enter()
                      .append("circle")
                      .attr("cx",d => xlinearScale(d.poverty))
                      .attr("cy",d => ylinearScale(d.healthcare))
                      .attr("r",20)
                      .attr("fill", "pink")
                      .attr("opacity", 0.9)
    //Create event listeners to display and hide the tooltip.                 
                      .on("click",function(d){
                        toolTip.show(d,this)
                      })
                      .on("mouseout", function(data, index) {
                        toolTip.hide(data)
                      })  
                      ;  

    // Step 11: Add text in circles.
    // =============================
    chartGroup.selectAll("circleText")
              .data(NewsPaper)
              .enter()
              .append("text")
              .attr("dx",d => xlinearScale(d.poverty))
              .attr("dy",d => ylinearScale(d.healthcare))
              .text(d=>d.abbr) 
              .style("text-anchor", "middle")
              .style("fill","white")
              .style("font-size",".8em")
              .style("font-family", "Times New Roman")
              .style("font-weight","bold");
    
    // Step 12: Create and append axes labels.
    //========================================
    chartGroup.append("text")
    .attr("transform", `translate(${chartwidth / 2}, ${chartheight + margin.top + 25})`)
    .attr("class", "axisText")
    .text("In Poverty (%)")
    .style("text-anchor", "middle")
    .style("font-family", "Times New Roman")
    .style("font-size", "20px")
    .style("font-weight","bold");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartheight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks in Healthcare (%)")
    .style("text-anchor", "middle")
    .style("font-family", "Times New Roman")
    .style("font-size", "20px")
    .style("font-weight","bold");

});    