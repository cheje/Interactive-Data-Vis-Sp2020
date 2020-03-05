/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
 let state = {
   geojson: null,
   schools: null,
   hover: {
     "Neighborhood (NTA)": null,
     Borough: null,
     "High School": null,
     Grades: null,
     "Number of Students": null,
     Latitude: null,
     Longitude: null,
   },
 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("./data/nyc_nta.geojson"),
  d3.csv("./data/hs_filtered.csv", d3.autoType),
]).then(([geojson, schools]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson;
  state.schools = schools;
  console.table("nta: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + SET UP PROJECTION
  // + SET UP GEOPATH
  const projection = d3
    .geoAlbersUsa()
    .fitSize([width, height], state.geojson);
  const path = d3
    .geoPath()
    .projection(projection);

  // + DRAW BASE MAP PATH
  // + ADD EVENT LISTENERS (if you want)
  svg
    .selectAll(".nta")
    // all of the features of the geojson, meaning all the states as individuals
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "nta")
    .on("mouseover", d => {
      // when the mouse rolls over this feature, do this
      state.hover["Neighborhood (NTA)"] = d.properties.ntaname;
      state.hover["Borough"] = d.properties.boro_name;
      draw(); // re-call the draw function when we set a new hoveredState
    });

  // EXAMPLE 1: going from Lat-Long => x, y
  // for how to position a dot
  svg
    .selectAll("circle")
    .data(state.schools)
    .join("circle")
    .attr("r", d => Math.sqrt(d.total_students*0.04)) // http://bl.ocks.org/mpmckenna8/566509dd3d9a08e5f9b2
    .attr("fill", d => {
      const pointColor = d3
        .scaleLinear()
        .domain([d3.min(state.schools, d => d.total_students), d3.max(state.schools, d => d.total_students)])
        .range(["#fed976", "#e31a1c"]);
      return pointColor(d.total_students)}) // https://www.d3-graph-gallery.com/graph/custom_color.html
    .attr("class", "point")
    .attr("transform", d => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`})
    .on("mouseover", d => {
      // when the mouse rolls over this feature, do this
      state.hover["High School"] = d.school_name;
      state.hover["Grades"] = d.finalgrades;
      state.hover["Number of Students"] = d.total_students;
      draw(); // re-call the draw function when we set a new hoveredState
    });

  // EXAMPLE 2: going from x, y => lat-long
  // this triggers any movement at all while on the svg
  svg.on("mousemove", () => {
    // we can use d3.mouse() to tell us the exact x and y positions of our cursor
    const [mx, my] = d3.mouse(svg.node());
    // projection can be inverted to return [lat, long] from [x, y] in pixels
    const proj = projection.invert([mx, my]);
    state.hover["Longitude"] = proj[0];
    state.hover["Latitude"] = proj[1];
    draw();
  });
  draw();
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {
 // return an array of [key, value] pairs
 hoverData = Object.entries(state.hover);

 d3.select("#hover-content")
   .selectAll("div.row")
   .data(hoverData)
   .join("div")
   .attr("class", "row")
   .html(
     d =>
       // each d is [key, value] pair
       d[1] // check if value exist
         ? `${d[0]}: ${d[1]}` // if they do, fill them in
         : null // otherwise, show nothing
   );
}
