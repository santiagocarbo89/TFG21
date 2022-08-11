var canvas;
var ctx;
var fileReader = new FileReader();

class ChartData{
  constructor() {
    this.unstructured_data = '';
    this.structured_data_tags = [];
    this.structured_data_values = [];
    this.variable_values = [];
    this.number_of_variables = 0;
    this.title = '';
  }

  getUnstructuredData(){
    return this.unstructured_data;
  }

  getNumberOfVariables(){
    return this.number_of_variables;
  }

  getTitle(){
    return this.title;
  }

  setUnstructuredData(uns_dat){
    this.unstructured_data = uns_dat;
  }

  setStructuredDataTags(i, s_dat_tags){
    this.structured_data_tags[i] = s_dat_tags;
  }

  setStructuredDataValues(i, s_dat_values){
    this.structured_data_values[i] = s_dat_values;
  }

  setVariableValues(i, var_val){
    this.variable_values[i] = var_val;
  }

  setNumberOfVariables(num_of_var){
    this.number_of_variables = num_of_var;
  }

  setTitle(title){
    this.title = title;
  }
}

var charts_data = [];

// Funciones para visibilizar y ocultar
function showHome(){
  document.getElementById("home").style.display = "block";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showData(){
  document.getElementById("home").style.display = "none";
  document.getElementById("data").style.display = "block";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showContact(){
  document.getElementById("home").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "block";
  document.getElementById("about").style.display = "none";
}

function showAbout(){
  document.getElementById("home").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "block";
}

//
function draw(){
    draw_logo();
    //draw_bar_chart();
}

// Logo
function draw_logo(){
    canvas = document.getElementById('logo');

    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
    }

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.lineTo(225, 150);
    ctx.fill();
    ctx.stroke();
}

// Bar Chart | Gráfico de barras


function draw_bar_chart() {
    canvas = document.getElementById('bar-chart');

    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
    }

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(30, 30, 50, 50);
}

// Pie Chart | Gráfico de barras

// Funciones auxiliares
function draw_axes(){
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.stroke();
  }
}

// Funciones para insertar archivos
function insertManager(file){
  fileReader.onload = function() {
    structure_data(fileReader.result, file[0].name);
  }

  fileReader.readAsText(file[0], "UTF-8");
}

function dropManager(event){
  event.preventDefault();

  var allFiles = event.dataTransfer.files;

  if(allFiles.length != 1){
      alert("You must drop just one file");
      return;
  }

  var file = allFiles[0];

  fileReader.onload = function() {
      structure_data(fileReader.result, file.name);
  }

  fileReader.readAsText(file, "UTF-8");
}

function dragoverManager(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function structure_data(uns_dat, tit){
  var chart_data = new ChartData();
  chart_data.setTitle(tit);
  chart_data.setUnstructuredData(uns_dat);

  var unstructured_data_by_endline = chart_data.getUnstructuredData().split("\n");
  unstructured_data_by_endline.shift();
  chart_data.setNumberOfVariables(unstructured_data_by_endline[0].split(";").length/2 - 1);
  var unstructured_data_split_by_semicolon = [];

  for(var i = 0; i < unstructured_data_by_endline.length; i++){
    unstructured_data_split_by_semicolon = unstructured_data_by_endline[i].split(";");

    if(i == 0){
      for(var j = 0; j < chart_data.length-2; j += 2)
        chart_data.setVariableValues(j, unstructured_data_split_by_semicolon[j+1]);
    }
          
    chart_data.setStructuredDataTags(i, unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-2]);
    chart_data.setStructuredDataValues(i, unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-1]);
  }

  charts_data.push(chart_data);
  addDataToHTML();
}

function addDataToHTML(){
  document.getElementById("content").innerHTML += 
  "<div id=\"chart_data\">" +
  "    <h3>DATA SLOT " + charts_data.length + "</h3>" +
  "    <p>Title: " + charts_data[charts_data.length-1].getTitle() + "</p>" +
  "    <p>Number of variables: "+ charts_data[charts_data.length-1].getNumberOfVariables() +"</p>" +
  "</div>";
}

