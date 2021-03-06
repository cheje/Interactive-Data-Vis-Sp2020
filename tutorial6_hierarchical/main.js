/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  data: null,
  hover: null,
  mousePosition: null,
};

/**
 * LOAD DATA
 * */
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3
    .select("#d3-container")
    .style("position", "relative");

  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //const colorScale = d3.scaleOrdinal(d3.schemeSet3);
  const colorScale = d3.scaleSequential([6, 0], d3.interpolateInferno); // https://github.com/d3/d3-scale-chromatic

  // make hierarchy
  const root = d3
    .hierarchy(state.data) // children accessor
    .sum(d => d.value) // sets the 'value' of each level
    .sort((a, b) => b.value - a.value);

  // make circle pack layout generator
  // https://observablehq.com/@d3/circle-packing
  const circlePack = d3
    .pack()
    .size([width, height])
    .padding(3);

  // call our generator on our root hierarchy node
  circlePack(root); // creates our coordinates and dimensions based on the heirarchy and tiling algorithm

  // create g for each leaf
  const node = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  node
    .append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => colorScale(d.height))
      //{const level1Ancestor = d.ancestors().find(d => d.depth === 1);
      //return colorScale(level1Ancestor.data.name);}
    //.attr("width", d => d.x1 - d.x0)
    //.attr("height", d => d.y1 - d.y0)
    .on("mouseover", d => {
      //
      //d3.select(this).style("opacity", .3);
      state.hover = {
        translate: [
          // center top left corner of the tooltip in center of tile
          d.x + 50,
          d.y - 50,
        ],
        name: d.data.name,
        value: d.data.value,
        title: `${d
          .ancestors()
          .reverse()
          .map(d => d.data.name)
          .join("/")}`,
      };
      draw();
      //
      });      //

  draw(); // calls the draw function
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
        <div><span style="color:orange; font-weight:bold;">Name:</span> ${state.hover.name}</div>
        <div><span style="color:orange; font-weight:bold;">Value:</span> ${state.hover.value}</div>
        <div><span style="color:orange; font-weight:bold;">Hierarchy Path:</span> ${state.hover.title}</div>
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
