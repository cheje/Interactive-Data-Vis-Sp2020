/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  root: null,
};

/**
 * LOAD DATA
 * */
d3.csv("./cpj_journalists_killed.csv", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3.select("#d3-container").style("position", "relative");

  tooltip = container
    .append("div")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute")
    .attr("class", "tooltip");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const uniqueRegions = [...new Set(state.data.map(d => d.region))];
  const colorScale = d3
    .scaleOrdinal()
    .domain(uniqueRegions)
    .range(d3.schemeCategory10); // https://github.com/d3/d3-scale-chromatic

  const rolledUp = d3.rollups(
    state.data,
    v => ({ count: v.length, journalists: v }), // reduce function,
    d => d.region,
    d => d.typeOfDeath,
    d => d.country,
  );

  console.log("rolledUp", rolledUp);

  // groups the data by genre, type and rating
  // make hierarchy
  const root = d3
    .hierarchy([null, rolledUp], ([key, values]) => values) // children accessor, tell it to grab the second element
    .sum(([key, values]) => values.count) // sets the 'value' of each level
    .sort((a, b) => b.value - a.value);

  // make treemap layout generator
  const tree = d3
    .treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  // call our generator on our root hierarchy node
  tree(root); // creates our coordinates and dimensions based on the heirarchy and tiling algorithm

  console.log(root);

  // create g for each leaf
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf
    .append("rect")
    .attr("fill-opacity", 0.6)
    .attr("fill", d => colorScale(d.data[1].journalists[0].region)) // take the genre from the first one in the group
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .on("mouseover", d => {
      console.log("d", d);
      state.hover = {
        translate: [
          // center tooltip in rect
          d.x0 + (d.x1 - d.x0) / 2,
          d.y0 + (d.y1 - d.y0) / 2,
        ],
        //name: d.data.typeOfDeath,
        value: d.value,
        hierarchy: `${d
          .ancestors()
          .reverse()
          .map(d => d.data[0])
          .join(" » ")}`,
      };
      draw();
    });

  draw();
}
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  if (state.hover) {
    tooltip
      .html(
        `
        <div>${state.hover.hierarchy}</div>
        <div>Number of Deaths: ${state.hover.value}</div>
        `
      )
      .transition()
      .duration(250)
      .style(
        "transform",
        `translate(${state.hover.translate[0]}px,${state.hover.translate[1]}px)`
      );
  }
}
