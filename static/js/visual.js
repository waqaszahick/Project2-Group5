var states=[];
var names=[];
var cities=[];
var ratings=[];
var rating = 0.00;
var labels=[];
var countByState=[];
var countByCity=[];
var coordinates=[];
var map;
// var valuesLimit = 10;
//read data file   
d3.json('/resturants').then(function(data){
  for(var i=0;i<data.length;i++){
    names.push(data[i]['0']);
  }
}); 
d3.json('/states').then(function(data){
  for(var i=0;i<data.length;i++){
    states.push(data[i]['0']);
  }
});
d3.json('/cities').then(function(data){
  for(var i=0;i<data.length;i++){
    cities.push(data[i]['0']);
  }
});
d3.json('/countByState').then(function(data){
  countByState = data;
  drawBarChart();
});
d3.json('/countByCity').then(function(data){
  countByCity = data;
});
d3.json('/coordinates').then(function(data){
  coordinates = data;
});

function drawBarChart(){
    $("#charts").find("#chart").remove();
    $("#charts").prepend($('<div id="chart"></div>'));
  if (map != null) {
    map.remove();
    map = null;
  }
  // data = data.slice(0,valuesLimit);
    dataa = [{
      x: states,
      y: countByState,
      // text: labels,
      type: "bar",
  }];
  Plotly.newPlot("chart", dataa);
}
function drawPieChart(){
  $("#charts").find("#chart").remove();
  $("#charts").prepend($('<div id="chart"></div>'));
  if (map != null) {
    map.remove();
    map = null;
  }
  /*define pie chart data*/
  var piedata = [{
    labels: states,
    values: countByState,
    type: "pie",
    domain: {column: 0},
    textinfo: "percent+label",
    hoverinfo:"label+value+percent",
    textposition: "inside",
},{
  values: countByCity,
  labels: cities,
  domain: {column: 1},
  name: '',
  textinfo:"percent+label",
  hoverinfo: 'label+percent+name',
  hole: .4,
  type: 'pie'
}];
/*define pie chart layout*/
var layout_pie = {
  // title: "Chart to show No. of Resturants in a State",
  annotations: [
    {
      font: {
        size: 20
      },
      showarrow: false,
      text: '',
      x: 0.17,
      y: 0.5
    },{
      font: {
        size: 20
      },
      showarrow: false,
      text: '',
      x: 0.82,
      y: 0.5
    }
  ],
  width: 1200,
  showlegend: true,
  grid: {rows: 1, columns: 2}
};
Plotly.newPlot("chart",piedata,layout_pie);
}
function drawBubbleChart() {
  $("#charts").find("#chart").remove();
  $("#charts").prepend($('<div id="chart"></div>'));
  if (map != null) {
    map.remove();
    map = null;
  }
  dataa = [{
    x: states,
    y: countByState,
    text: labels,
    type: "bubble",
    mode: 'markers',
    marker: {
      color:countByState,
      size: countByState,
    },
  }];
  var layout = {
    
    // title: 'Chart to show Resturants-Rating',
  };
  Plotly.newPlot("chart", dataa,layout);
}
function showMap(){
  if (map != null) {
    map.remove();
    map = null;
  }
  // Adding tile layer
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// map object to an array of layers we created.
 map = L.map("chart", {
  // center: [-21.0999565,95.1351643],
  center: [-25.2744,133.7751],
  zoom: 4,
  layers: [graymap_background, satellitemap_background, outdoors_background]
});

// adding one 'graymap' tile layer to the map.
graymap_background.addTo(map);

// Initialize all of the LayerGroups we'll be using
// var faultlines = new L.LayerGroup();
var Citites = new L.LayerGroup();
Citites = L.markerClusterGroup();

// base layers
var baseMaps = {
  Grayscale: graymap_background,
  Outdoors: outdoors_background,
  Satellite: satellitemap_background,
};

// Create an overlays object to add to the layer control
var overlayMaps = {
  // "Fault Lines": faultlines,
  "Citites": Citites
};


// Create a control for our layers, add our overlay layers to it
// L.control.layers(null, overlays).addTo(map);
// control which layers are visible.
L.control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

  
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();
    // var coordinates = [{'lat':34.34343,'lon':34.34343},{'lat':34.34343,'lon':34.34343}];
    // Loop through data
    
    for (var i = 0; i < coordinates.length; i++) {
  
      // Set the data location property to a variable
      var latitude = coordinates[i].lat;
      var longitude = coordinates[i].lon;
      

      var location = [];
      location.push(latitude)
      location.push(longitude)

      function styleInfo(coordinates) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(coordinates.length),
          color: "#000000",
          radius: getRadius(coordinates.length),
          stroke: true,
          weight: 0.5
        };
      }
    
      // Define the color of the marker based on the rating of the earthquake.
      function getColor(size) {
        switch (true) {
          case size > 5:
            return "#ea2c2c";
          case size > 4:
            return "#ea822c";
          case size > 3:
            return "#ee9c00";
          case size > 2:
            return "#eecc00";
          case size > 1:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
    
      // define the radius of the earthquake marker based on its rating.
    
      function getRadius(size) {
        
        if (size === 0) {
          return 1;
        }
    
        return parseInt(size) * 50;
      }

      markers.addLayer(L.circle(location,styleInfo(coordinates))
        .bindPopup("Restaurants: "+names[i]));
  

  // earthquakes.addTo(map);
  // L.geoJson(coordinates,{
  //   style:styleInfo
  // }).addTo(Citites);

  markers.addTo(Citites);
  // Add our marker cluster layer to the map
  map.addLayer(Citites);

      }
  

}
function drawD3Chart(){
  $("#charts").find("#chart").remove();
  $("#charts").prepend($('<div id="chart"></div>'));
  var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "state";
var chosenYAxis = "name";

// function used for updating x-scale var upon click on axis label
function xScale(scatData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(scatData, d => d[chosenXAxis]),
      d3.max(scatData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;

}
function yScale(scatData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(scatData, d => d[chosenYAxis]),
  d3.max(scatData, d => d[chosenYAxis])
])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
//function for updating STATE labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(2000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textGroup
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var xLabel,yLabel;

  if (chosenXAxis === "state") {
    xLabel = "State:";
  }
  else if(chosenXAxis === "City") {
    xLabel = "City:"  
  }

  if (chosenYAxis === "name") {
    yLabel = "Quantity:";
  }
  

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`State: ${d.state}<br>${xLabel} ${d[chosenXAxis]}%<br>${yLabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    
  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.json('/fullData').then(function(scatData, err) {
  if (err) throw err;

  // parse data
  scatData.forEach(function(data) {
    data.state = +data.state;
    data.name = +data.name;
    data.city = +data.city;
    // data.obesity = +data.obesity;
    // data.age = +data.age;
    // data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(scatData, chosenXAxis);
  var yLinearScale = yScale(scatData, chosenYAxis);  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(scatData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var XLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var stateLabel = XLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "state") // value to grab for event listener
    .classed("active", true)
    .style('font-family', 'bahnschrift')
    .text("By State");

  var cityLabel = XLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "city") // value to grab for event listener
    .classed("inactive", true)
    .style('font-family', 'bahnschrift')
    .text("By Cities");

    var yXLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
  // append y axis

var qtyLabel = yXLabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("value","name")
  .classed("inactive", true)
  .style('font-family', 'bahnschrift')
  .text("No. of Restuarants");
  
  
    var textGroup = chartGroup.selectAll(".stateText")
      .data(scatData)
      .enter()
      .append("text")
      .classed('stateText', true)
      .style('font-family', 'bahnschrift')      
      .attr("font-size", "8px")
      .attr("fill", "blue")
      .attr("dy", ".4em")
      .attr("dx", "-.7em")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text("bb");
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

  // x axis labels event listener
  XLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(scatData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
//update text 
textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
        
        // changes classes to change bold text
        if (chosenXAxis === "city") {
          cityLabel
            .classed("active", true)
            .classed("inactive", false);
          stateLabel
            .classed("active", false)
            .classed("inactive", true);
            
        }
        else if(chosenXAxis === "state") {
          cityLabel
            .classed("active", false)
            .classed("inactive", true);
          stateLabel
            .classed("active", true)
            .classed("inactive", false);
           
        }
      }
    });
    yXLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
        
        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(scatData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
        //update text 
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
        
        // changes classes to change bold text
        if (chosenYAxis === "name") {
          qtyLabel
            .classed("active", true)
            .classed("inactive", false);
          
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});

}
function showBonusMap(){
  if (map != null) {
    map.remove();
    map = null;
  }

// map object to an array of layers we created.
 map = L.map("chart", {
  center: [-25.2744,133.7751],
  zoom: 4,
  fullscreenControl: true,
});
var layers = [];
            for (var providerId in providers) {
                layers.push(providers[providerId]);
            }

            layers.push({
                layer: {
                    onAdd: function() {},
                    onRemove: function() {}
                },
                title: 'empty'
            })

// Initialize all of the LayerGroups we'll be using
// var faultlines = new L.LayerGroup();
var Citites = new L.LayerGroup();
Citites = L.markerClusterGroup();



// control which layers are visible.
L.control
.iconLayers(layers)
  .addTo(map);

  L.easyPrint({
    title: 'Download Image',
    position: 'topright',
    exportOnly:true, //set false if you want to print
    sizeModes: ['Current','A4Portrait', 'A4Landscape']
  }).addTo(map);
  
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through data
    
    for (var i = 0; i < coordinates.length; i++) {
  
      // Set the data location property to a variable
      var latitude = coordinates[i].lat;
      var longitude = coordinates[i].lon;
      

      var location = [];
      location.push(latitude)
      location.push(longitude)

      function styleInfo(coordinates) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(coordinates.length),
          color: "#000000",
          radius: getRadius(coordinates.length),
          stroke: true,
          weight: 0.5
        };
      }
    
      // Define the color of the marker based on the rating of the earthquake.
      function getColor(size) {
        switch (true) {
          case size > 5:
            return "#ea2c2c";
          case size > 4:
            return "#ea822c";
          case size > 3:
            return "#ee9c00";
          case size > 2:
            return "#eecc00";
          case size > 1:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
    
      // define the radius of the earthquake marker based on its rating.
    
      function getRadius(size) {
        
        if (size === 0) {
          return 1;
        }
    
        return parseInt(size) * 50;
      }           

      markers.addLayer(L.circle(location,styleInfo(coordinates))
        .bindPopup("Restaurants: "+names[i]));

  markers.addTo(Citites);
  // Add our marker cluster layer to the map
  map.addLayer(Citites);

}
  

}