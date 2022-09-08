// Variables Canvas API
var canvas;
var ctx;

// Variables para lectura de archivos
var fileReader = new FileReader();

// Constantes que indican el ancho y el alto del canvas de las gráficas
const charts_width = 750;
const charts_height = 750;


// Clase 'DataSeries' que encapsula los datos procesados del .csv
class DataSeries{
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

  structure_data(){
    var unstructured_data_by_endline = this.getUnstructuredData().split("\n");
    unstructured_data_by_endline.shift();
    this.setNumberOfVariables(unstructured_data_by_endline[0].split(";").length/2 - 1);
    var unstructured_data_split_by_semicolon;
  
    for(var i = 0; i < unstructured_data_by_endline[0].split(";").length-2; i ++){
      if(i % 2 == 0)
        this.setVariableTags(unstructured_data_by_endline[0].split(";")[i]);
      else
        this.setVariableValues(unstructured_data_by_endline[0].split(";")[i]);
    }
  
    var aux_value;
  
    for(var i = 0; i < unstructured_data_by_endline.length-1; i++){
      unstructured_data_split_by_semicolon = unstructured_data_by_endline[i].split(";");
  
      this.setStructuredDataTags(i, unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-2]);
  
      aux_value = unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-1].replace(',','.');
  
      this.setStructuredDataValues(i, aux_value);
    }
  }

  // Funciones auxiliares para gráficas
  getMaxSerieValue() {
    return Math.max.apply(null, this.getStructuredDataValues());
  }
}

var data_series = []; // Vector de series de datos
var bar_charts = []; // Vector de gráficos de barras
var line_charts = []; // Vector de gráficos de líneas
var pie_charts = []; // Vector de gráficos circulares

// Clase 'Chart'
class Chart{
  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    this.id = id;
    this.data_serie = data_serie;
    this.letter_font = letter_font;
    this.sectionColor = 'white';
    this.previousSectionColor = 'white';
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  /* Métodos */

  getId(){
    return this.id;
  }

  getDataSerie(){
    return this.data_serie;
  }

  getLetterFont(){
    return this.letter_font;
  }

  getStrokeStyle(){
    return this.strokeStyle;
  }

  getLineWidth(){
    return this.lineWidth;
  }

  setStrokeStyle(strokeStyle){
    this.strokeStyle = strokeStyle;
  }

  setLineWidth(lineWidth){
    this.lineWidth = lineWidth;
  }

  // Función para obtener un color pastel aleatorio que no sea igual al anterior
  getSectionColor(){
    do{
      this.sectionColor = 360 * Math.random();
    }while(this.previousSectionColor == this.sectionColor);
    this.previousSectionColor = this.sectionColor;

    /* Establecemos 'lightness' en un 90% para 
    que aparezcan colores pastel*/
    return "hsl(" + this.sectionColor + ", 100%, 90%)";
  }

  insertChartData(){
    var new_content = 
    "<div class=\"" + this.getChartType()  + "-chart\">" +
    "    <h3>Title: " + data_series[data_series.length-1].getTitle() + "</h3>" +
    "    <p><b>Selection criteria length:</b>"+ data_series[data_series.length-1].getNumberOfVariables() +"</p>";
  
    for(var i = 0; i < data_series[data_series.length-1].getNumberOfVariables(); i++){
      new_content += "<p><b>\tSelection criteria " + (i+1) + " (" + data_series[data_series.length-1].getVariableTags()[i] + "):</b> " + data_series[data_series.length-1].getVariableValues()[i] + "</p>";
    }
  
    new_content += "<canvas id=\"" + this.getChartType()  + "-chart-" + data_series.length + "\"></canvas>";
    new_content += "</div>";
  
    document.getElementById(this.getChartType()  + "-charts-content").innerHTML += new_content;
    document.getElementById(this.getChartType()  + "-chart-" + data_series.length).width = charts_width.toString();
    document.getElementById(this.getChartType()  + "-chart-" + data_series.length).height = charts_height.toString();
    
    this.refresh();
  }
}

class BarChart extends Chart{
  /* Atributos de clase */
  static CEALING = 370;
  static FACTOR_CEALING = 0.75;
  static NUMBER_OF_VERTICAL_LINES = 10;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);
  }

  /* Métodos */
  getChartType(){
    return 'bar';
  }

  refresh(){
    draw_logo();
    draw_bar_charts();
  }
}

class LineChart extends Chart{
  /* Atributos de clase */
  static CEALING = 370;
  static FACTOR_CEALING = 0.75;
  static NUMBER_OF_VERTICAL_LINES = 10;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);
  }

  /* Métodos */
  getChartType(){
    return 'line';
  }

  refresh(){
    draw_logo();
    draw_line_charts();
  }
}

class PieChart extends Chart{
  /* Atributos de clase */
  static X_CENTER = 300;
  static Y_CENTER = 300;
  static BIG_RADIO = 250;
  static RADIO = 200;
  static SMALL_RADIO = 150;
  static SMALL_GRADIENT_RADIO = 5;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);
  }

  /* Métodos */
  getChartType(){
    return 'pie';
  }

  refresh(){
    draw_logo();
    draw_pie_charts();
  }
}

// Funciones para visibilizar y ocultar
function showHome(){
  var select = document.getElementById('select-graph');
  select.selectedIndex = 0; // En 'Home' siempre dejamos que el índice elegido sea el 0

  document.getElementById("home").style.display = "block";
  document.getElementById("bar-charts-content").style.display = "none";
  document.getElementById("line-charts-content").style.display = "none";
  document.getElementById("pie-charts-content").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showData(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts-content").style.display = "none";
  document.getElementById("line-charts-content").style.display = "none";
  document.getElementById("pie-charts-content").style.display = "none";
  document.getElementById("data").style.display = "block";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function showContact(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts-content").style.display = "none";
  document.getElementById("line-charts-content").style.display = "none";
  document.getElementById("pie-charts-content").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "block";
  document.getElementById("about").style.display = "none";
}

function showAbout(){
  document.getElementById("home").style.display = "none";
  document.getElementById("bar-charts-content").style.display = "none";
  document.getElementById("line-charts-content").style.display = "none";
  document.getElementById("pie-charts-content").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("contact").style.display = "none";
  document.getElementById("about").style.display = "block";
}

function showGraphs(){
  var select = document.getElementById('select-graph');
  var graph = select.options[select.selectedIndex].value;

  if(graph == "none") {
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
  } else if(graph == "bar"){ // Mostrar gráficos de barras
    document.getElementById("bar-charts-content").style.display = "block";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
  } else if(graph == "line") {  // Mostrar gráficos de líneas
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "block";
    document.getElementById("pie-charts-content").style.display = "none";
  } else if(graph == "pie") {  // Mostrar gráficos de barras
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "block";
  }
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

// Gráficos de barras
function draw_bar_charts() {
  for(var i = 0; i < bar_charts.length; i++){
    var bar_chart = bar_charts[i];
    var chart_id = "bar-chart-" + bar_chart.getId();
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var data_serie = bar_chart.getDataSerie();

    // Parámetros de estilo
    ctx.strokeStyle = bar_chart.getStrokeStyle();
    ctx.lineWidth = bar_chart.getLineWidth();
    ctx.font = bar_chart.getLetterFont();

    // Eje de abcisas y de ordenadas
    ctx.beginPath();
    ctx.moveTo(50,10);
    ctx.lineTo(50, BarChart.CEALING);
    ctx.lineTo(charts_width, BarChart.CEALING);
    ctx.stroke();

    var factor_y = (BarChart.CEALING * BarChart.FACTOR_CEALING)/data_serie.getMaxSerieValue(); // Factor para que el gráfico tenga siempre cierto tamaño
    var number_tag;

    for(var j = 0; j < BarChart.NUMBER_OF_VERTICAL_LINES; j++){
      ctx.beginPath();
      ctx.moveTo(45,((BarChart.CEALING + 28)/BarChart.NUMBER_OF_VERTICAL_LINES) * j + 11);
      ctx.lineTo(50,((BarChart.CEALING + 28)/BarChart.NUMBER_OF_VERTICAL_LINES) * j + 11);
      ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = (BarChart.CEALING + 28)/factor_y*((BarChart.NUMBER_OF_VERTICAL_LINES-j-1)/BarChart.NUMBER_OF_VERTICAL_LINES);
      ctx.fillText(number_tag.toFixed(2) + "", 0, ((BarChart.CEALING + 28)/BarChart.NUMBER_OF_VERTICAL_LINES)*j + 11); // Números referencias
    }

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var value = data_serie.getStructuredDataValues()[j];
      var x0 = 55 + j*40;
      var y0 = BarChart.CEALING - value*factor_y - 1;
      var x1 = x0 + 35;
      var y1 = y0 + value*factor_y;

      var gradient = ctx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(0, bar_chart.getSectionColor());
      gradient.addColorStop(1, "white");
      ctx.fillStyle = gradient;
      ctx.fillRect(x0, y0, 35, value*factor_y); //Rellenar los rectángulos de la gráfica
      ctx.strokeRect(x0, y0, 35, value*factor_y); // El contorno de los rectángulos
    }

    ctx.fillStyle = "black";

    // Etiquetas verticales y valores de la serie horizonatales
    for(var j = 0; j < data_serie.getStructuredDataTags().length; j++){
      ctx.fillText(data_serie.getStructuredDataValues()[j], 60 + j*40, BarChart.CEALING - data_serie.getStructuredDataValues()[j]*factor_y - 10);
      ctx.fillText(data_serie.getStructuredDataTags()[j], 60 + j*40, BarChart.CEALING + 15);
    }
  }
}

// Gráfico de líneas
function draw_line_charts() {
  for(var i = 0; i < line_charts.length; i++){
    var line_chart = line_charts[i];
    var chart_id = "line-chart-" + line_chart.getId();
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var data_serie = line_chart.getDataSerie();

    // Parámetros de estilo
    ctx.strokeStyle = line_chart.getStrokeStyle();
    ctx.lineWidth = line_chart.getLineWidth();
    ctx.font = line_chart.getLetterFont();

    // Eje de abcisas y de ordenadas
    ctx.beginPath();
    ctx.moveTo(50,10);
    ctx.lineTo(50, LineChart.CEALING);
    ctx.lineTo(charts_width, LineChart.CEALING);
    ctx.stroke();

    var factor_y = (LineChart.CEALING * LineChart.FACTOR_CEALING)/data_serie.getMaxSerieValue(); // Factor para que el gráfico tenga siempre cierto tamaño
    var number_tag;

     for(var j = 0; j < LineChart.NUMBER_OF_VERTICAL_LINESNUMBER_OF_VERTICAL_LINES; j++){
      ctx.beginPath();
      ctx.moveTo(45,((LineChart.CEALING + 28)/LineChart.NUMBER_OF_VERTICAL_LINES)*j + 11);
      ctx.lineTo(50,((LineChart.CEALING + 28)/LineChart.NUMBER_OF_VERTICAL_LINES)*j + 11);
      ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = (LineChart.CEALING + 28)/factor_y*((LineChart.NUMBER_OF_VERTICAL_LINES-j-1)/LineChart.NUMBER_OF_VERTICAL_LINES);
      ctx.fillText(number_tag.toFixed(2) + "", 0, ((LineChart.CEALING + 28)/LineChart.NUMBER_OF_VERTICAL_LINES)*j + 10); // Números referencias
    }

    line_chart.setStrokeStyle("hsl(7, 0%, 30%)");
    ctx.strokeStyle = line_chart.getStrokeStyle();
    line_chart.setLineWidth(3.0);
    ctx.lineWidth = line_chart.getLineWidth();
    ctx.beginPath();
    ctx.moveTo(65, LineChart.CEALING - data_serie.getStructuredDataValues()[0]*factor_y - 1); // Inicio del gráfico de líneas

    for(var j = 1; j < data_serie.getStructuredDataValues().length; j++){
      var value = data_serie.getStructuredDataValues()[j];
      ctx.lineTo(65 + j*40,LineChart.CEALING - value*factor_y-1); // Cada línea del gráfico de líneas
    }

    ctx.stroke(); // Dibujamos todo el gráfico de líneas

    // Etiquetas verticales y valores de la serie horizonatales
    for(var j = 0; j < data_serie.getStructuredDataTags().length; j++){
      ctx.fillText(data_serie.getStructuredDataValues()[j], 60 + j*40, LineChart.CEALING - data_serie.getStructuredDataValues()[j]*factor_y - 10);
      ctx.fillText(data_serie.getStructuredDataTags()[j], 60 + j*40, LineChart.CEALING + 15);
    }
  }
}

// Gráfico circular
function draw_pie_charts() {
  for(var i = 0; i < pie_charts.length; i++){
    var pie_chart = pie_charts[i];
    var chart_id = "pie-chart-" + pie_chart.getId();
    canvas = document.getElementById(chart_id);
  
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var data_serie = pie_chart.getDataSerie();
    var totalValues = 0;

     // Parámetros de estilo
    ctx.lineWidth = pie_chart.getLineWidth();
    ctx.font = pie_chart.getLetterFont(); // Fuente del texto
    ctx.strokeStyle = pie_chart.getStrokeStyle();

    /* Calculamos la suma de todos los valores para poder dividir 
    el gráfico circular en secciones */
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      totalValues += parseFloat(data_serie.getStructuredDataValues()[j]);
    }

    var lastAngle = 0; // El ángulo inicial es 0
      
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(data_serie.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;
      
      ctx.beginPath();
      ctx.moveTo(PieChart.X_CENTER,PieChart.Y_CENTER);
      
      /* Crea arcos de una circunferencia de centro (300, 300) y de radio 200
      en el sentido de las agujas del reloj, creando un ángulo de (currentAngle-lastAngle) radianes */
      ctx.arc(PieChart.X_CENTER,PieChart.Y_CENTER, PieChart.RADIO, lastAngle, currentAngle, false);
      ctx.lineTo(PieChart.X_CENTER,PieChart.Y_CENTER);
      var gradient = ctx.createRadialGradient(PieChart.X_CENTER, PieChart.Y_CENTER, PieChart.SMALL_GRADIENT_RADIO, PieChart.X_CENTER, PieChart.Y_CENTER, PieChart.RADIO);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, pie_chart.getSectionColor());
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.stroke();
      
      lastAngle = currentAngle;
    }
    
    ctx.fillStyle = "black";
    lastAngle = 0; // Volvemos a establecer como ángulo inicial 0

    // Los valores y las etiquetas, creados de la misma forma que el anterior bucle
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(data_serie.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;

      ctx.fillText(data_serie.getStructuredDataTags()[j], PieChart.BIG_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.X_CENTER, PieChart.BIG_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER);
      ctx.fillText(data_serie.getStructuredDataValues()[j], PieChart.SMALL_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.X_CENTER, PieChart.SMALL_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER);
      
      lastAngle = currentAngle;
    }
  }
}

// Funciones para insertar archivos
function insertManager(file){
  fileReader.onload = function() {
    document.getElementById("title-textbox").style.display = "block";
    submitCharts(fileReader.result);
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
    document.getElementById("title-textbox").style.display = "block";
    submitCharts(fileReader.result);
  }

  fileReader.readAsText(file, "UTF-8");
}

function dragoverManager(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function submitCharts(file){
  var form = document.getElementById("form-textbox");

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    var title = document.getElementsByName('title')[0].value;
    document.getElementById('title').value = '';


    var chart_data = new DataSeries();
    chart_data.setTitle(title);
    chart_data.setUnstructuredData(file);
    chart_data.structure_data();

    data_series.push(chart_data);

    // Gráfico de barras
    var bar_chart = new BarChart(bar_charts.length + 1, chart_data, '10pt Times New Roman', 'black', 2.0);
    bar_charts.push(bar_chart);
    bar_chart.insertChartData();

    // Gráfico de líneas
    var line_chart = new LineChart(line_charts.length + 1, chart_data, '10pt Times New Roman', 'black', 2.0);
    line_charts.push(line_chart);
    line_chart.insertChartData();

    // Gráfico circular
    var pie_chart = new PieChart(pie_charts.length + 1, chart_data, '10pt Times New Roman', 'black', 2.0);
    pie_charts.push(pie_chart);
    pie_chart.insertChartData();

    document.getElementById("title-textbox").style.display = "none";

    var new_content = 
    "<div id=\"chart_data\">" +
    "    <h3>Title:  " + data_series[data_series.length-1].getTitle() + "</h3>" +
    "    <p>Selection criteria length: "+ data_series[data_series.length-1].getNumberOfVariables() +"</p>";
  
    for(var i = 0; i < data_series[data_series.length-1].getNumberOfVariables(); i++){
      new_content += "<p>Selection criteria " + (i+1) + " (" + data_series[data_series.length-1].getVariableTags()[i] + "): " + data_series[data_series.length-1].getVariableValues()[i] + "</p><br></br>";
    }
  
    new_content += "</div>";
    document.getElementById("content").innerHTML += new_content;
  }, { once: true });
}

