const data = [{"state":"Texas","amount":366},
              {"state":"Illinois","amount":308},
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

const width = window.innerWidth * 0.5, // width of svg = half of browser window
  height = window.innerHeight / 1.75,
  paddingInner = 0.2, // padding in between bars
  margin = { top: 20, bottom: 100, left: 10, right: 40 };

// scales transform/map data to lengths for bar charts

const xScale = d3
  .scaleBand() // divides up range between domain values: https://observablehq.com/@d3/d3-scaleband
  .domain(data.map(d => d.state)) // state names
  .range([margin.left, width - margin.right]) // 10, half of browser width - right margin of svg
  .paddingInner(paddingInner);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d.amount)]) // 0, 366
  .range([height - margin.bottom, margin.top]); // height of svg - 40, 20

// reference for d3.axis: https://github.com/d3/d3-axis
const xAxis = d3.axisBottom(xScale).ticks(data.length);

/** MAIN CODE */
const svg = d3
  .select("#d3-container")
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
  .attr("fill", "steelblue")

// append text
const text = svg
  .selectAll("text")
  .data(data)
  .join("text")
  .attr("class", "label")
  // this allows us to position the text in the center of the bar
  .attr("x", d => xScale(d.state) + (xScale.bandwidth() / 5))
  .attr("y", d => yScale(d.amount))
  .text(d => d.amount)
  .attr("dy", "1.25em");

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${(height - margin.bottom)})`)
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .style("font-family", "Montserrat")
  .attr("dx", "-0.7em")
  .attr("dy", "0.1em")
  .attr("transform", "rotate(-65)");
