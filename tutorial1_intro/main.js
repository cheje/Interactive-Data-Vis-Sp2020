// load in csv
d3.csv("https://raw.githubusercontent.com/cheje/Interactive-Data-Vis-Sp2020/master/tutorial1_intro/data/nyc_jan_temps.csv").then(data => {
  console.log("data", data);

  // select single instance of table
  const table = d3.select("#temps-table");

  // table header
  const thead = table.append("thead"); // not already in html
  thead
    .append("tr")
    .append("th")
    .attr("colspan", "12")
    .text("High Temperatures in NYC Over the Past Decade")
    .style("text-align", "center");

  // column names
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("th")
    .text(d => d)
    //.style("border-right", "solid 1px #E8E8E8")
      .style("color","#808080");
      //.style("font-style", "italic");

  thead
    .selectAll("th:first-child")
      .style("color", "#404040");

  // rows
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr")

  // cells
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    .text(d => d);
    
  rows
    .selectAll("td:not(:first-child)")
      .style("color", d => (d <= 32) ? "#3182bd" : "#de2d26") // functions: https://www.w3schools.com/js/js_if_else.asp
      .style("background-color", "#F8F8F8");

  rows
    .selectAll("td:last-child")
      .style("border-right", "none");
});