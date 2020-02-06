// load in csv
d3.csv("data/commuting_states.csv").then(data => {
  console.log("data", data);

  // select single instance of table
  const table = d3.select("#temps-table");

  // table header
  const thead = table.append("thead"); // not already in html
  thead
    .append("tr")
    .append("th")
    .attr("colspan", "12")
    .text("Commuting to Work (%)")
      .style("text-align", "left")
      .style("font-size", "18px");

  // column names
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("th")
    .text(d => d)
      .style("color","#808080");

  thead
    .selectAll("th:first-child")
      .style("color", "#404040");

  // rows
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr");

  // cells
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    .text(d => d);
  
  // tried to turn min and max values in each column a certain color but couldn't figure it out
  // let minDrove = d3.min(data, function(d) { return d['Drove alone']; });
  // let maxDrove = d3.max(data, function(d) { return d['Drove alone']; });
  // let minCarpool = d3.min(data, function(d) { return +d.Carpooled; });
  // let maxCarpool = d3.max(data, function(d) { return +d.Carpooled; });

  rows
    .selectAll("td:not(:first-child)")
    .attr("class", d => +d >= 10 ? "double-digits" : null);
  //rows
      //.attr("id", function(d) { return d.State; })
      //.select("#Georgia"); // https://stackoverflow.com/questions/26730147/how-to-select-individual-rows-in-a-d3-table

      // if above average, highlight in red: http://learnjsdata.com/summarize_data.html
      // .style("color", function(d) {
      //   let avgDrove = d3.mean(data, function(d) { return d['Drove alone']; });
      //   if (d > avgDrove) {
      //     return "#de2d26";
      //   }
      //   console.log(avgDrove);
      //.style("color", function(d) {
      //  if (Object.values(d['Drove alone']) === minDrove) { return "#de2d26";}

  rows
    .selectAll("td:last-child")
      .style("border-right", "none");

// averages row: https://stackoverflow.com/questions/37044713/how-can-we-sum-the-data-of-csv-file-columnwise-using-d3-js

  let totalAvgs = [d3.mean(data.map(function(d){ return d['Drove alone'] })),
    d3.mean(data.map(function(d){ return d.Carpooled })),
    d3.mean(data.map(function(d){ return d['Public transportation'] })),
    d3.mean(data.map(function(d){ return d.Walked })),
    d3.mean(data.map(function(d){ return d['Taxi, motorcycle, bike, etc.'] })),
    d3.mean(data.map(function(d){ return d['Worked at home'] }))];

   
  table
    .append("tfoot")
    .append("tr")
    .text("Average")
      .style("font-weight", "bold")
    .selectAll("td")
    .data(totalAvgs)
    .join("td")
    .text(d => d3.format(".1f")(d)); // decimal place: https://observablehq.com/@d3/d3-format
});

