// load in csv
d3.csv("https://raw.githubusercontent.com/cheje/Interactive-Data-Vis-Sp2020/master/tutorial1_intro/data/nyc_january_temps.csv").then(data => {
  console.log("data", data);
  // https://raw.githubusercontent.com/cheje/Interactive-Data-Vis-Sp2020/master/data/surveyResults.csv
  // https://raw.githubusercontent.com/cheje/Interactive-Data-Vis-Sp2020/master/tutorial1_intro/data/nyc_january_temps.csv

  // select single instance of table
  const table = d3.select("#temps-table");

  // table header
  const thead = table.append("thead"); // not already in html
  thead
    .append("tr")
    .append("th")
    .attr("colspan", "12")
    .text("NYC High Temperatures in January Over the Past Decade")
    .style("text-align", "center");

  // column names
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("th")
    .text(d => d);

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
    
  rows
    .selectAll("td:not(:first-child)")
    .style("color", d => (d <= 32) ? "blue" : "red"); // functions: https://www.w3schools.com/js/js_if_else.asp

  rows.selectAll("td:first-child")
    .style("background-color", "#E8E8E8");
});