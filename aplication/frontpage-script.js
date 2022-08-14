var canvas;
var ctx;
var fileReader = new FileReader();
var sectionColor;
var previousSectionColor;
var bar_chart_width = "750";
var bar_chart_width_integer = 750;
var bar_chart_height = "750";
var cealing = 370;
var factor_cealing = 0.75;
var number_of_vertical_lines = 10;

function getSectionColor(){
  do{
    sectionColor = Math.floor(Math.random()*16777215).toString(16);
  }while(previousSectionColor == sectionColor);
  previousSectionColor = sectionColor;

  return ('#' + sectionColor);
}


class ChartData{
  constructor() {
    this.unstructured_data = '';
    this.structured_data_tags = [];
    this.structured_data_values = [];
    this.variable_tags = [];
    this.variable_values = [];
    this.number_of_variables = 0;
    this.title = '';
  }

  getUnstructuredData(){
    return this.unstructured_data;
  }

  getStructuredDataTags(){
    return this.structured_data_tags;
  }

  getStructuredDataValues(){
    return this.structured_data_values;
  }

  getNumberOfVariables(){
    return this.number_of_variables;
  }

  getVariableTags(){
    return this.variable_tags;
  }

  getVariableValues(){
    return this.variable_values;
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

  setVariableTags(var_tag){
    this.variable_tags.push(var_tag);
  }

  setVariableValues(var_val){
    this.variable_values.push(var_val);
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
  document.getElementById("bar-charts").style.display = "none";
  document.getElementById("line-charts").style.display = "none";
  document.getElementById("pie-charts").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showData(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts").style.display = "none";
  document.getElementById("line-charts").style.display = "none";
  document.getElementById("pie-charts").style.display = "none";
  document.getElementById("data").style.display = "block";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showContact(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts").style.display = "none";
  document.getElementById("line-charts").style.display = "none";
  document.getElementById("pie-charts").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "block";
  document.getElementById("about").style.display = "none";
}

function showAbout(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts").style.display = "none";
  document.getElementById("line-charts").style.display = "none";
  document.getElementById("pie-charts").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "block";
}

function showBarCharts(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts").style.display = "block";
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

// Bar Charts | Gráficos de barras
function draw_bar_charts() {
  for(var i = 0; i < charts_data.length; i++){
    var chart_id = "bar-chart-" + (i+1);
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(50,10);
    ctx.lineTo(50,cealing);
    ctx.lineTo(bar_chart_width_integer,cealing);
    ctx.stroke();

    var factor_y = (cealing*factor_cealing)/getMaxSerieValue(i);

    for(var j = 0; j < number_of_vertical_lines; j++){
      ctx.fillText("1000000", 0, ((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.beginPath();
      ctx.moveTo(45,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.lineTo(50,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.stroke();
    }

    var current_chart = charts_data[i];

    for(var j = 0; j < current_chart.getStructuredDataValues().length; j++){
      ctx.fillStyle = getSectionColor();
      var value = current_chart.getStructuredDataValues()[j];
      ctx.fillRect(55 + j*40,cealing-value*factor_y-1, 35, value*factor_y);
    }

    ctx.fillStyle = "black";

    for(var j = 0; j < current_chart.getStructuredDataTags().length; j++){
      ctx.fillText(current_chart.getStructuredDataTags()[j], 60 + j*40, cealing + 10);
    }
  }
}

// Pie Chart | Gráfico de barras

// Funciones auxiliares para gráficas
function getMaxSerieValue(i) {
  return Math.max.apply(null, charts_data[i].getStructuredDataValues());
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
  var unstructured_data_split_by_semicolon;

  for(var i = 0; i < unstructured_data_by_endline[0].split(";").length-2; i ++){
    if(i % 2 == 0)
      chart_data.setVariableTags(unstructured_data_by_endline[0].split(";")[i]);
    else
      chart_data.setVariableValues(unstructured_data_by_endline[0].split(";")[i]);
  }

  var aux_value;

  for(var i = 0; i < unstructured_data_by_endline.length-1; i++){
    unstructured_data_split_by_semicolon = unstructured_data_by_endline[i].split(";");

    chart_data.setStructuredDataTags(i, unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-2]);

    aux_value = unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-1].replace(',','.');

    chart_data.setStructuredDataValues(i, aux_value);
  }
  
  charts_data.push(chart_data);
  createBarChart();
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

function createBarChart(){
  var new_content = 
  "<div class=\"bar-chart\">" +
  "    <h3>Title: " + charts_data[charts_data.length-1].getTitle() + "</h3>" +
  "    <strong>Number of variables: "+ charts_data[charts_data.length-1].getNumberOfVariables() +"</strong><br></br>";

  for(var i = 0; i < charts_data[charts_data.length-1].getNumberOfVariables(); i++){
    new_content += "<strong>Variable " + (i+1) + " (" + charts_data[charts_data.length-1].getVariableTags()[i] + "): " + charts_data[charts_data.length-1].getVariableValues()[i] + "</strong><br></br>";
  }

  new_content += "<canvas id=\"bar-chart-" + charts_data.length + "\"></canvas>";
  new_content += "</div>";

  document.getElementById("bar-charts-content").innerHTML += new_content;
  document.getElementById("bar-chart-" + charts_data.length).width = bar_chart_width;
  document.getElementById("bar-chart-" + charts_data.length).height = bar_chart_height;
  draw_bar_charts();
}

