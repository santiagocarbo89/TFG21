// Variables Canvas API
var canvas;
var ctx;

// Variables para lectura de archivos
var fileReader = new FileReader();

// Variables para colores
var sectionColor;
var previousSectionColor;

// Constantes que indican el ancho y el alto del canvas de las gráficas
const charts_width = 750;
const charts_height = 750;

// Constantes utilizadas para las gráficas de barras y líneas
const cealing = 370;
const factor_cealing = 0.75;
const number_of_vertical_lines = 10;

// Constantes utilizadas para las gráficas circulares
const piechart_x_center = 300;
const piechart_y_center = 300;
const piechart_big_radio = 250;
const piechart_radio = 200;
const piechart_small_radio = 150;
const piechart_small_gradient_radio = 5;

// Función para obtener un color pastel aleatorio que no sea igual al anterior
function getSectionColor(){
  do{
    sectionColor = 360*Math.random();
  }while(previousSectionColor == sectionColor);
  previousSectionColor = sectionColor;

  /* Establecemos 'lightness' en un 90% para 
  que aparezcan colores pastel*/
  return "hsl(" + sectionColor + ", 100%, 90%)";
}

// Clase 'ChartData' que encapsula los datos procesados del .csv
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

var charts_data = []; // Vector de gráficas

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

function showLineCharts(){
  document.getElementById("home").style.display = "none";
  document.getElementById("line-charts").style.display = "block";
}

function showPieCharts(){
  document.getElementById("home").style.display = "none";
  document.getElementById("pie-charts").style.display = "block";
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
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.lineTo(225, 150);
    ctx.fill();
    ctx.strokeStyle = "black";
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

    // Eje de abcisas y de ordenadas
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(50,10);
    ctx.lineTo(50, cealing);
    ctx.lineTo(charts_width,cealing);
    ctx.stroke();

    var factor_y = (cealing*factor_cealing)/getMaxSerieValue(i); // Factor para que el gráfico tenga siempre cierto tamaño
    var number_tag;
    ctx.font = '10pt Times New Roman'; // Fuente del texto

    for(var j = 0; j < number_of_vertical_lines; j++){
      ctx.beginPath();
      ctx.moveTo(45,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.lineTo(50,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = (cealing+28)/factor_y*((number_of_vertical_lines-j-1)/number_of_vertical_lines);
      ctx.fillText(number_tag.toFixed(2) + "", 0, ((cealing+28)/number_of_vertical_lines)*j + 11); // Números referencias
    }

    var current_chart = charts_data[i];
    ctx.strokeStyle = "black";

    for(var j = 0; j < current_chart.getStructuredDataValues().length; j++){
      var value = current_chart.getStructuredDataValues()[j];
      var x0 = 55 + j*40;
      var y0 = cealing-value*factor_y-1;
      var x1 = x0 + 35;
      var y1 = y0 + value*factor_y;

      var gradient = ctx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(0, getSectionColor());
      gradient.addColorStop(1, "white");
      ctx.fillStyle = gradient;
      ctx.fillRect(x0, y0, 35, value*factor_y); //Rellenar los rectángulos de la gráfica
      ctx.strokeRect(x0, y0, 35, value*factor_y); // El contorno de los rectángulos
    }

    ctx.fillStyle = "black";

    // Etiquetas verticales y valores de la serie horizonatales
    for(var j = 0; j < current_chart.getStructuredDataTags().length; j++){
      ctx.fillText(current_chart.getStructuredDataValues()[j], 60 + j*40, cealing - current_chart.getStructuredDataValues()[j]*factor_y - 10);
      ctx.fillText(current_chart.getStructuredDataTags()[j], 60 + j*40, cealing + 15);
    }
  }
}

// Line Chart | Gráfico de líneas
function draw_line_charts() {
  for(var i = 0; i < charts_data.length; i++){
    var chart_id = "line-chart-" + (i+1);
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

     // Eje de abcisas y de ordenadas
     ctx.strokeStyle = "black";
     ctx.lineWidth = 2.0;
     ctx.beginPath();
     ctx.moveTo(50,10);
     ctx.lineTo(50, cealing);
     ctx.lineTo(charts_width,cealing);
     ctx.stroke();
 
     var factor_y = (cealing*factor_cealing)/getMaxSerieValue(i); // Factor para que el gráfico tenga siempre cierto tamaño
     var number_tag;
     ctx.font = '10pt Times New Roman'; // Fuente del texto

     for(var j = 0; j < number_of_vertical_lines; j++){
      ctx.beginPath();
      ctx.moveTo(45,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.lineTo(50,((cealing+28)/number_of_vertical_lines)*j + 11);
      ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = (cealing+28)/factor_y*((number_of_vertical_lines-j-1)/number_of_vertical_lines);
      ctx.fillText(number_tag.toFixed(2) + "", 0, ((cealing+28)/number_of_vertical_lines)*j + 10); // Números referencias
    }

    var current_chart = charts_data[i];
    ctx.strokeStyle = "hsl(7, 0%, 30%)";
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(65,cealing-current_chart.getStructuredDataValues()[0]*factor_y-1); // Inicio del gráfico de líneas

    for(var j = 1; j < current_chart.getStructuredDataValues().length; j++){
      var value = current_chart.getStructuredDataValues()[j];
      ctx.lineTo(65 + j*40,cealing-value*factor_y-1); // Cada línea del gráfico de líneas
    }

    ctx.stroke(); // Dibujamos todo el gráfico de líneas

    // Etiquetas verticales y valores de la serie horizonatales
    for(var j = 0; j < current_chart.getStructuredDataTags().length; j++){
      ctx.fillText(current_chart.getStructuredDataValues()[j], 60 + j*40, cealing - current_chart.getStructuredDataValues()[j]*factor_y - 10);
      ctx.fillText(current_chart.getStructuredDataTags()[j], 60 + j*40, cealing + 15);
    }
  }
}

// Pie Chart | Gráfico circular
function draw_pie_charts() {
  for(var i = 0; i < charts_data.length; i++){
    var chart_id = "pie-chart-" + (i+1);
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var current_chart = charts_data[i];
    var totalValues = 0;
    ctx.lineWidth = 2.0;
    ctx.font = '10pt Times New Roman'; // Fuente del texto

    /* Calculamos la suma de todos los valores para poder dividir 
    el gráfico circular en secciones */
    for(var j = 0; j < current_chart.getStructuredDataValues().length; j++){
      totalValues += parseFloat(current_chart.getStructuredDataValues()[j]);
    }

    var lastAngle = 0; // El ángulo inicial es 0
    ctx.strokeStyle = "black";
      
    for(var j = 0; j < current_chart.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(current_chart.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;
      
      ctx.beginPath();
      ctx.moveTo(piechart_x_center,piechart_y_center);
      
      /* Crea arcos de una circunferencia de centro (300, 300) y de radio 200
      en el sentido de las agujas del reloj, creando un ángulo de (currentAngle-lastAngle) radianes */
      ctx.arc(piechart_x_center,piechart_y_center, piechart_radio, lastAngle, currentAngle, false);
      ctx.lineTo(piechart_x_center,piechart_y_center);
      var gradient = ctx.createRadialGradient(piechart_x_center, piechart_y_center, piechart_small_gradient_radio, piechart_x_center, piechart_y_center, piechart_radio);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, getSectionColor());
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.stroke();
      
      lastAngle = currentAngle;
    }
    
    ctx.fillStyle = "black";
    lastAngle = 0; // Volvemos a establecer como ángulo inicial 0

    // Los valores y las etiquetas, creados de la misma forma que el anterior bucle
    for(var j = 0; j < current_chart.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(current_chart.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;

      ctx.fillText(current_chart.getStructuredDataTags()[j], piechart_big_radio*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + piechart_x_center, piechart_big_radio*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + piechart_y_center);
      ctx.fillText(current_chart.getStructuredDataValues()[j], piechart_small_radio*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + piechart_x_center, piechart_small_radio*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + piechart_y_center);
      
      lastAngle = currentAngle;
    }
  }
}

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
  createLineChart();
  createPieChart();
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
  document.getElementById("bar-chart-" + charts_data.length).width = charts_width.toString();
  document.getElementById("bar-chart-" + charts_data.length).height = charts_height.toString();
  draw_bar_charts();
}

function createLineChart(){
  var new_content = 
  "<div class=\"line-chart\">" +
  "    <h3>Title: " + charts_data[charts_data.length-1].getTitle() + "</h3>" +
  "    <strong>Number of variables: "+ charts_data[charts_data.length-1].getNumberOfVariables() +"</strong><br></br>";

  for(var i = 0; i < charts_data[charts_data.length-1].getNumberOfVariables(); i++){
    new_content += "<strong>Variable " + (i+1) + " (" + charts_data[charts_data.length-1].getVariableTags()[i] + "): " + charts_data[charts_data.length-1].getVariableValues()[i] + "</strong><br></br>";
  }

  new_content += "<canvas id=\"line-chart-" + charts_data.length + "\"></canvas>";
  new_content += "</div>";

  document.getElementById("line-charts-content").innerHTML += new_content;
  document.getElementById("line-chart-" + charts_data.length).width = charts_width.toString();
  document.getElementById("line-chart-" + charts_data.length).height = charts_height.toString();
  draw_line_charts();
}

function createPieChart(){
  var new_content = 
  "<div class=\"pie-chart\">" +
  "    <h3>Title: " + charts_data[charts_data.length-1].getTitle() + "</h3>" +
  "    <strong>Number of variables: "+ charts_data[charts_data.length-1].getNumberOfVariables() +"</strong><br></br>";

  for(var i = 0; i < charts_data[charts_data.length-1].getNumberOfVariables(); i++){
    new_content += "<strong>Variable " + (i+1) + " (" + charts_data[charts_data.length-1].getVariableTags()[i] + "): " + charts_data[charts_data.length-1].getVariableValues()[i] + "</strong><br></br>";
  }

  new_content += "<canvas id=\"pie-chart-" + charts_data.length + "\"></canvas>";
  new_content += "</div>";

  document.getElementById("pie-charts-content").innerHTML += new_content;
  document.getElementById("pie-chart-" + charts_data.length).width = charts_width.toString();
  document.getElementById("pie-chart-" + charts_data.length).height = charts_height.toString();
  draw_pie_charts();
} 

