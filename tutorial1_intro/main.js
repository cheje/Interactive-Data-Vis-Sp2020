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
    .text("Commuting to Work (percent)")
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
    
  let minDrove = d3.min(data, function(d) { return d['Drove alone']; });
  let maxDrove = d3.max(data, function(d) { return d['Drove alone']; });
  let minCarpool = d3.min(data, function(d) { return +d.Carpooled; });
  let maxCarpool = d3.max(data, function(d) { return +d.Carpooled; });

  rows
    .selectAll("td:not(:first-child)")
      //.style("color", d => (d <= 10) ? "#808080" : "#de2d26"); // functions: https://www.w3schools.com/js/js_if_else.asp
      // if above average, highlight in red: http://learnjsdata.com/summarize_data.html
      // .style("color", function(d) {
      //   let avgDrove = d3.mean(data, function(d) { return d['Drove alone']; });
      //   if (d > avgDrove) {
      //     return "#de2d26";
      //   }
      //   console.log(avgDrove);
      .style("color", function(d) {
        if (d[Array('Drove alone')] === minDrove || d['Drove alone'] === maxDrove) { return "#de2d26";}
      console.log(maxCarpool);
    });
  
    console.log(data.columns[1]);

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

    console.log(totalAvgs);

  totalAvgsRounded = d3.format(".1f")(4.56)
        table
        .append("tfoot")
        .append("tr")
        .text("Average")
          .style("text-align", "right")
          .style("font-weight", "bold")
        .selectAll("td")
        .data(totalAvgs)
        .join("td")
        .text(d => d);
});

