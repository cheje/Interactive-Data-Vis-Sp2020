const data = [{"state":"Texas","amount":366},
              {"state":"Illinois","amount":309},
              {"state":"New York","amount":268},
              {"state":"California","amount":199},
              {"state":"Michigan","amount":103},
              {"state":"Ohio","amount":83},
              {"state":"Pennsylvania","amount":83},
              {"state":"Florida","amount":73},
              {"state":"Massachusetts","amount":67},
              {"state":"North Carolina","amount":64},
              {"state":"Louisiana","amount":59},
              {"state":"Wisconsin","amount":57},
              {"state":"Virginia","amount":52},
              {"state":"Washington","amount":50},
              {"state":"Missouri","amount":47}]

const width = window.innerWidth * 0.33, // width of svg = half of browser window
  height = window.innerHeight / 1.75,
  paddingInner = 0.2, // padding in between bars
  margin = { top: 30, bottom: 100, left: 10, right: 40 };

// scales transform/map data to lengths for bar charts

const xScale = d3
  .scaleBand() // divides up range between domain values: https://observablehq.com/@d3/d3-scaleband
  .domain(data.map(d => d.state)) // state names
  .range([margin.left, width - margin.right]) // 10, half of browser width - right margin of svg
  .paddingInner(paddingInner);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d.amount)]) // d3.max(data, function) produces domain([0, 366])
  .range([height - margin.bottom, margin.top]); // height of svg - range([40, 20])

const xAxis = d3
  .axisBottom(xScale)
  .ticks(data.length);

// adding sequential color palette to bars
// https://www.d3-graph-gallery.com/graph/custom_color.html
// https://github.com/d3/d3-scale-chromatic
const barColor = d3
  .scaleLinear()
  .domain([d3.min(data, d => d.amount), d3.max(data, d => d.amount)])
  .range(["#fed976", "#f03b20"]);
// using a palette:
//const barColor = d3.scaleSequential().domain([d3.min(data, d => d.amount), d3.max(data, d => d.amount)]).interpolator(d3.interpolateYlOrRd);

// svg
const svg = d3
  .select("#d3-vbar")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// append rects
const rect = svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("y", d => yScale(d.amount))
  .attr("x", d => xScale(d.state))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.amount))
  .attr("fill", d => barColor(d.amount));

// append text: https://alignedleft.com/tutorials/d3/making-a-bar-chart
const text = svg
  .selectAll("text")
  .data(data)
  .join("text")
  //.attr("class", "label")
  .attr("text-anchor", "middle")
  .attr("fill", d => barColor(d.amount))
  .attr("x", d => xScale(d.state) + (xScale.bandwidth() / 2)) // position text in center on atop bar
  .attr("y", d => yScale(d.amount) - 25)
  .text(d => d.amount)
  .attr("dy", "1.25em");

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${(height - margin.bottom)})`) // use transform attribute to situate axis right below bars
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .style("font-family", "Montserrat") // change x-axis label font
  .attr("dx", "-0.7em")
  .attr("dy", "0.1em")
  .attr("transform", "rotate(-65)"); // rotate x-axis label text

// HORIZONTAL BAR CHART

const hwidth = window.innerWidth * 0.5, // width of svg = half of browser window
  hheight = window.innerHeight / 1.5,
  hpaddingInner = 0.2, // padding in between bars
  hmargin = { top: 30, bottom: 100, left: 105, right: 300 };

// scales transform/map data to lengths for bar charts

const hxScale = d3
  .scaleLinear() // divides up range between domain values: https://observablehq.com/@d3/d3-scaleband
  //.domain(data.map(d => d.amount)) // state names
  .domain([0, d3.max(data, d => d.amount)]) // d3.max(data, function) produces domain([0, 366])
  .range([hmargin.left, hwidth - hmargin.right]); // 10, half of browser width - right margin of svg

const hyScale = d3
  .scaleBand()
  //.domain([0, d3.max(data, d => d.state)]) // d3.max(data, function) produces domain([0, 366])
  .domain(data.map(d => d.state)) // state names
  .range([hmargin.top, hheight - hmargin.bottom]) // height of svg - range([40, 20])
  .paddingInner(hpaddingInner);

const hyAxis = d3
  .axisLeft(hyScale)
  .ticks(data.length);

// adding sequential color palette to bars
// https://www.d3-graph-gallery.com/graph/custom_color.html
// https://github.com/d3/d3-scale-chromatic
const hbarColor = d3
  .scaleLinear()
  .domain([d3.min(data, d => d.amount), d3.max(data, d => d.amount)])
  .range(["#fed976", "#f03b20"]);
// using a palette:
//const barColor = d3.scaleSequential().domain([d3.min(data, d => d.amount), d3.max(data, d => d.amount)]).interpolator(d3.interpolateYlOrRd);

// svg
const hsvg = d3
  .select("#d3-hbar")
  .append("svg")
  .attr("width", hwidth)
  .attr("height", hheight);

// append rects
const hrect = hsvg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => 58 + (d3.min(data, d => d.amount))) // https://stackoverflow.com/questions/25047562/d3-js-horizontal-bar-graph-change-bar-direction-left-to-right-instead-of-righ
  .attr("y", d => hyScale(d.state))
  .attr("width", d => hxScale(d.amount) + 50)
  .attr("height", hyScale.bandwidth())
  .attr("fill", d => hbarColor(d.amount));

// text
const htext = hsvg
  .selectAll("text")
  .data(data)
  .join("text")
  //.attr("class", "label")
  .attr("fill", d => hbarColor(d.amount))
  .attr("x", d => hxScale(d.amount) + 150)
  .attr("y", d => hyScale(d.state) + (hyScale.bandwidth() / 2)) // position text in center on atop bar
  .text(d => d.amount)
  .attr("text-anchor", "middle")
  .attr("dx", "1.5em")
  .attr("dy", "0.5em");

// y-axis
hsvg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(${hmargin.left}, 0)`) // use transform attribute to situate axis right below bars
  .call(hyAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .style("font-family", "Montserrat"); // change x-axis label font
  // .attr("dx", "-0.7em")
  // .attr("dy", "0.1em");
