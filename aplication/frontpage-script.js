class CanvasAPIApplication {
  constructor(){
    // Variables Canvas API
    this.canvas;
    this.ctx;

    // Variables para lectura de archivos
    this.fileReader = new FileReader();

    this.fileReader.onload = function() {
      document.getElementById("title-textbox").style.display = "block";
    }

    this.data_series = []; // Vector de series de datos
    this.bar_charts = []; // Vector de gráficos de barras
    this.line_charts = []; // Vector de gráficos de líneas
    this.pie_charts = []; // Vector de gráficos circulares
  }

  /* Métodos */
  showHome(){
    //var select = document.getElementById('select-graph');
    //select.selectedIndex = 0; // En 'Home' siempre dejamos que el índice elegido sea el 0

    document.getElementById("home").style.display = "block";
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
  }

  showData(){
    document.getElementById("home").style.display = "none";
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
    document.getElementById("data").style.display = "block";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
  }

  showContact(){
    document.getElementById("home").style.display = "none";
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "block";
    document.getElementById("about").style.display = "none";
  }

  showAbout(){
    document.getElementById("home").style.display = "none";
    document.getElementById("bar-charts-content").style.display = "none";
    document.getElementById("line-charts-content").style.display = "none";
    document.getElementById("pie-charts-content").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "block";
  }

  showGraphs(){
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

  selectFile(){
    var insert_file = document.getElementById("insert-file");
  
    if(insert_file)
      insert_file.click();
  }


  insertManager(file){
    if(file.length > 1)
      alert("Insert just one file, please.");

    this.fileReader.readAsText(file[0], "UTF-8");
    document.getElementById("file-loaded").style.display = "block";
  }

  dropManager(event){
    event.preventDefault();

    if(event.dataTransfer.items && event.dataTransfer.files.length == 1){
      this.fileReader.readAsText(event.dataTransfer.files[0], "UTF-8");
      event.dataTransfer.items.clear();
      document.getElementById("file-loaded").style.display = "block";
    } else if(event.dataTransfer.items && event.dataTransfer.files.length > 1){
      alert("Drop just one file, please.");
    }else
      event.dataTransfer.clearData()
  }

  dragoverManager(event) {
    event.preventDefault();
  }


  submitCharts(event){
    event.preventDefault();

    var title = document.getElementsByName('title')[0].value;
    document.getElementById('title').value = '';

    var file = this.fileReader.result;

    var chart_data = new DataSeries(this.data_series.length);
    chart_data.setTitle(title);
    chart_data.setUnstructuredData(file);
    chart_data.structure_data();

    this.data_series.push(chart_data);

    // Gráfico de barras
    var bar_chart = new BarChart(this.bar_charts.length, chart_data, '10pt Times New Roman', 
      this.ctx.measureText(chart_data.getMaxSerieValue().toString()).width, 
        this.ctx.measureText(chart_data.getStructuredDataTags()[0]).width,'black', 2.0);
    
    bar_chart.setColors();
    this.bar_charts.push(bar_chart);
    bar_chart.insertChartData();

    // Gráfico de líneas
    var line_chart = new LineChart(this.line_charts.length, chart_data, '10pt Times New Roman', 'black', 2.0);
    this.line_charts.push(line_chart);
    line_chart.insertChartData();

    // Gráfico circular
    var pie_chart = new PieChart(this.pie_charts.length, chart_data, '10pt Times New Roman', 'black', 2.0);

    pie_chart.setColors();
    this.pie_charts.push(pie_chart);
    pie_chart.insertChartData();

    document.getElementById("title-textbox").style.display = "none";
    document.getElementById("file-loaded").style.display = "none";

    var new_content = 
    "<div class=\"chart_data\" id=\"chart-data-" + chart_data.getId() + "\">" +
    "    <button class=\"remove-serie-button\" id=\"remove-serie-button-" + chart_data.getId() + "\" onclick=\"application.removeDataSerie(this.id)\">Eliminar serie de datos</button>" +
    "    <h3>Título:  " + this.data_series[this.data_series.length-1].getTitle() + "</h3>" +
    "    <hr class=\"solid\">" +
    "    <p><b>Criterios de selección usados:</b> "+ this.data_series[this.data_series.length-1].getNumberOfVariables() +"</p>";
  
    for(var i = 0; i < this.data_series[this.data_series.length-1].getNumberOfVariables(); i++){
      new_content += "<p><u>Criterio de selección " + (i+1) + " (" + this.data_series[this.data_series.length-1].getVariableTags()[i] + "):</u> " + this.data_series[this.data_series.length-1].getVariableValues()[i] + "</p>";
    }
  
    new_content += "</div>";
    document.getElementById("content").innerHTML += new_content;

    for(var i = 0; i < this.bar_charts.length; i++)
      this.draw_bar_chart(i);
    
    for(var i = 0; i < this.line_charts.length; i++)
      this.draw_line_chart(i);

    for(var i = 0; i < this.pie_charts.length; i++)
      this.draw_pie_chart(i);
  }

  
  draw_logo(){
    this.canvas = document.getElementById('logo');

    if(this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.ctx.fillStyle = 'green';

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(175, 25);
    this.ctx.lineTo(75, 125);
    this.ctx.fill();
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

    this.ctx.fillStyle = 'blue';
    this.ctx.beginPath();
    this.ctx.moveTo(175, 25);
    this.ctx.lineTo(75, 125);
    this.ctx.lineTo(225, 150);
    this.ctx.fill();
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  // Gráficos de barras
  draw_bar_chart(id){
    var bar_chart = this.bar_charts[id];
    var chart_id = "bar-chart-" + id;
    this.canvas = document.getElementById(chart_id);
  
    if(this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    var data_serie = bar_chart.getDataSerie();

    // Parámetros de estilo
    this.ctx.strokeStyle = bar_chart.getStrokeStyle();
    this.ctx.lineWidth = bar_chart.getLineWidth();
    this.ctx.lineCap = bar_chart.getLineCap();
    this.ctx.font = bar_chart.getLetterFont();
    this.ctx.globalAlpha = bar_chart.getTransparency();

    // Eje de abcisas y de ordenadas
    this.ctx.beginPath();
    this.ctx.moveTo(BarChart.PADDING_LEFT, BarChart.PADDING_TOP);
    this.ctx.lineTo(BarChart.PADDING_LEFT, Chart.HEIGHT - BarChart.PADDING_BOTTOM);
    this.ctx.lineTo(bar_chart.getWidth() - BarChart.PADDING_RIGHT, Chart.HEIGHT - BarChart.PADDING_BOTTOM);
    this.ctx.stroke();

    var number_tag;

    for(var j = 0; j < bar_chart.getNumberOfVerticalLines(); j++){

      bar_chart.setStrokeStyle('black');
      this.ctx.strokeStyle = bar_chart.getStrokeStyle();
      
      this.ctx.beginPath();
      this.ctx.moveTo(BarChart.PADDING_LEFT - BarChart.VERTICAL_LINES_WIDTH,
        BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*j);

      this.ctx.lineTo(BarChart.PADDING_LEFT, 
        BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*j);

      bar_chart.setStrokeStyle('#e5e4e2');
      this.ctx.strokeStyle = bar_chart.getStrokeStyle();

      this.ctx.lineTo(bar_chart.getWidth() - BarChart.PADDING_RIGHT,
          BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*j);

      this.ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = bar_chart.getMaxValueChart()*(bar_chart.getNumberOfVerticalLines() - j - 1)/(bar_chart.getNumberOfVerticalLines() - 1);
      
      this.ctx.fillText(Math.ceil(number_tag).toString(), BarChart.LETTERS_MARGIN_LEFT, 
        BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*j); // Números referencias
    }

    bar_chart.setStrokeStyle('black');
    this.ctx.strokeStyle = bar_chart.getStrokeStyle();
      

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var value = data_serie.getStructuredDataValues()[j];
      var x0 = BarChart.PADDING_LEFT + BarChart.BARS_MARGIN + (bar_chart.bar_width + BarChart.SPACE_BETWEEN_BARS)*j;
      var y0 = Chart.HEIGHT - BarChart.PADDING_BOTTOM - bar_chart.getScaleFactorY()*value;
      var x1 = x0 + bar_chart.bar_width;
      var y1 = y0 + bar_chart.getScaleFactorY()*value;

      var gradient = this.ctx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(1 - bar_chart.getGradient(), bar_chart.getColors()[j]);
      gradient.addColorStop(1, bar_chart.getGradientColor());
      this.ctx.fillStyle = gradient;

      //Shadows
      if(bar_chart.getShadows()){
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'black';
      } else {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillRect(x0, y0, bar_chart.bar_width, bar_chart.getScaleFactorY()*value); //Rellenar los rectángulos de la gráfica

      // Las sombras solo afectan a los rectángulos
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.shadowBlur = 0;

      this.ctx.strokeRect(x0, y0, bar_chart.bar_width, bar_chart.getScaleFactorY()*value); // El contorno de los rectángulos

      this.ctx.fillStyle = "black";

      this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
        (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.bar_width + BarChart.SPACE_BETWEEN_BARS)*j, 
          Chart.HEIGHT - BarChart.PADDING_BOTTOM + BarChart.LETTERS_MARGIN_TOP); // Tags
      
      this.ctx.fillText(data_serie.getStructuredDataValues()[j], 
        (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.bar_width + BarChart.SPACE_BETWEEN_BARS)*j, 
          Chart.HEIGHT - BarChart.PADDING_BOTTOM - bar_chart.getScaleFactorY()*data_serie.getStructuredDataValues()[j] - BarChart.LETTERS_MARGIN_BOTTOM); // Values
    }
  }

  // Gráficos de líneas
  draw_line_chart(id) {
    var line_chart = this.line_charts[id];
    var chart_id = "line-chart-" + line_chart.getId();
    this.canvas = document.getElementById(chart_id);
  
    if(this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    var data_serie = line_chart.getDataSerie();

    // Parámetros de estilo
    this.ctx.fillStyle = "black";
   this.ctx.strokeStyle = line_chart.getStrokeStyle();
   this.ctx.lineWidth = line_chart.getLineWidth();
   this.ctx.lineCap = line_chart.getLineCap();
   this.ctx.font = line_chart.getLetterFont();
   this.ctx.globalAlpha = line_chart.getTransparency();

    // Eje de abcisas y de ordenadas
    this.ctx.beginPath();
    this.ctx.moveTo(LineChart.PADDING_LEFT, LineChart.PADDING_TOP);
    this.ctx.lineTo(LineChart.PADDING_LEFT, Chart.HEIGHT - LineChart.PADDING_BOTTOM);
    this.ctx.lineTo(line_chart.getWidth() - LineChart.PADDING_RIGHT, Chart.HEIGHT - LineChart.PADDING_BOTTOM);
    this.ctx.stroke();

    var number_tag;

    for(var j = 0; j < line_chart.getNumberOfVerticalLines(); j++){

      line_chart.setStrokeStyle('black');
      this.ctx.strokeStyle = line_chart.getStrokeStyle();
      
      this.ctx.beginPath();
      this.ctx.moveTo(LineChart.PADDING_LEFT - LineChart.VERTICAL_LINES_WIDTH,
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*j);

      this.ctx.lineTo(LineChart.PADDING_LEFT, 
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*j);

      line_chart.setStrokeStyle('#e5e4e2');
      this.ctx.strokeStyle = line_chart.getStrokeStyle();
  
      this.ctx.lineTo(line_chart.getWidth() - LineChart.PADDING_RIGHT,
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*j);

      this.ctx.stroke(); // Líneas verticales que indican los números de referencia

      number_tag = line_chart.getMaxValueChart()*(line_chart.getNumberOfVerticalLines() - j - 1)/(line_chart.getNumberOfVerticalLines() - 1);
      
      this.ctx.fillText(Math.ceil(number_tag).toString(), LineChart.LETTERS_MARGIN_LEFT, 
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*j); // Números referencias
    }

    line_chart.setStrokeStyle('black');
    this.ctx.strokeStyle = line_chart.getStrokeStyle();

    this.ctx.beginPath();
    this.ctx.moveTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN, 
      Chart.HEIGHT - BarChart.PADDING_BOTTOM - data_serie.getStructuredDataValues()[0]*line_chart.getScaleFactorY()); // Inicio del gráfico de líneas

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      line_chart.setStrokeStyle("hsl(7, 0%, 30%)");
      this.ctx.strokeStyle = line_chart.getStrokeStyle();

      var value = data_serie.getStructuredDataValues()[j];

      //Shadows
      if(line_chart.getShadows()){
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'black';
      } else {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
      }

      this.ctx.lineTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN + LineChart.SPACE_BETWEEN_POINTS*j, 
        Chart.HEIGHT - BarChart.PADDING_BOTTOM - value*line_chart.getScaleFactorY()); // Cada línea del gráfico de líneas

      this.ctx.stroke();

      // Las sombras solo afectan a las líneas
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.shadowBlur = 0;

      line_chart.setStrokeStyle("black");
      this.ctx.strokeStyle = line_chart.getStrokeStyle();

      this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
        (LineChart.PADDING_LEFT + LineChart.LINES_MARGIN) + LineChart.SPACE_BETWEEN_POINTS*j, 
          Chart.HEIGHT - LineChart.PADDING_BOTTOM + LineChart.LETTERS_MARGIN_TOP); // Tags
      
      this.ctx.fillText(data_serie.getStructuredDataValues()[j], 
        (LineChart.PADDING_LEFT + LineChart.LINES_MARGIN) + LineChart.SPACE_BETWEEN_POINTS*j, 
          Chart.HEIGHT - LineChart.PADDING_BOTTOM - line_chart.getScaleFactorY()*data_serie.getStructuredDataValues()[j] - LineChart.LETTERS_MARGIN_BOTTOM); // Values
    }
  }

  // Gráficos circulares
  draw_pie_chart(id) {
    var pie_chart = this.pie_charts[id];
    var chart_id = "pie-chart-" + pie_chart.getId();
    this.canvas = document.getElementById(chart_id);
  
    if(this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    var data_serie = pie_chart.getDataSerie();
    var totalValues = 0;

    // Parámetros de estilo
    this.ctx.lineWidth = pie_chart.getLineWidth();
    this.ctx.font = pie_chart.getLetterFont(); // Fuente del texto
    this.ctx.strokeStyle = pie_chart.getStrokeStyle();

    /* Calculamos la suma de todos los valores para poder dividir 
    el gráfico circular en secciones */
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      totalValues += parseFloat(data_serie.getStructuredDataValues()[j]);
    }

    var lastAngle = 0; // El ángulo inicial es 0
      
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(data_serie.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;
      
      this.ctx.beginPath();
      this.ctx.moveTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);

      //Shadows
      if(pie_chart.getShadows()){
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'black';
      } else {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
      }

      /* Crea arcos de una circunferencia de centro (300, 300) y de radio 200
      en el sentido de las agujas del reloj, creando un ángulo de (currentAngle-lastAngle) radianes */
      this.ctx.arc(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, 
          PieChart.RADIO, lastAngle, currentAngle, false);
        
      this.ctx.lineTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
      
      var gradient = this.ctx.createRadialGradient(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, PieChart.SMALL_GRADIENT_RADIO*pie_chart.getGradient(), 
      PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, PieChart.RADIO);
      
      gradient.addColorStop(0, pie_chart.getGradientColor());
      gradient.addColorStop(1, pie_chart.getColors()[j]);
      this.ctx.fillStyle = gradient;

      this.ctx.fill();
      this.ctx.stroke();
      
      lastAngle = currentAngle;
    }

    // Las sombras solo afectan a las líneas
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
    
    this.ctx.fillStyle = "black";
    lastAngle = 0; // Volvemos a establecer como ángulo inicial 0

    // Los valores y las etiquetas, creados de la misma forma que el anterior bucle
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(data_serie.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;

      this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
      PieChart.BIG_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.BIG_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
      
      this.ctx.fillText(data_serie.getStructuredDataValues()[j], 
      PieChart.SMALL_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.SMALL_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
      
      lastAngle = currentAngle;
    }
  }

  // Gráficos de barras
  changeLineWidthBarChart(id, value){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setLineWidth(value);
    this.draw_bar_chart(real_id);
  }

  changeShadowsBarChart(id){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setShadows();
    this.draw_bar_chart(real_id);
  }

  changeTransparencyBarChart(id, value){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setTransparency(value);
    this.draw_bar_chart(real_id);
  }

  changeLineCapBarChart(id, value){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setLineCap(value);
    this.draw_bar_chart(real_id);
  }

  changeGradientBarChart(id, value){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setGradient(value);
    this.draw_bar_chart(real_id);
  }

  changeGradientColorBarChart(id, value){
    var real_id = id.substr(id.length - 1);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setGradientColor(value);
    this.draw_bar_chart(real_id);
  }

  // Gráficos de líneas
  changeLineWidthLineChart(id, value){
    var real_id = id.substr(id.length - 1);
    var line_chart = this.line_charts[real_id];
    line_chart.setLineWidth(value);
    this.draw_line_chart(real_id);
  }

  changeShadowsLineChart(id){
    var real_id = id.substr(id.length - 1);
    var line_chart = this.line_charts[real_id];
    line_chart.setShadows();
    this.draw_line_chart(real_id);
  }

  changeTransparencyLineChart(id, value){
    var real_id = id.substr(id.length - 1);
    var line_chart = this.line_charts[real_id];
    line_chart.setTransparency(value);
    this.draw_line_chart(real_id);
  }

  changeLineCapLineChart(id, value){
    var real_id = id.substr(id.length - 1);
    var line_chart = this.line_charts[real_id];
    line_chart.setLineCap(value);
    this.draw_line_chart(real_id);
  }

  // Gráficos circulares
  changeLineWidthPieChart(id, value){
    var real_id = id.substr(id.length - 1);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setLineWidth(value);
    this.draw_pie_chart(real_id);
  }

  changeShadowsPieChart(id){
    var real_id = id.substr(id.length - 1);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setShadows();
    this.draw_pie_chart(real_id);
  }

  changeTransparencyPieChart(id, value){
    var real_id = id.substr(id.length - 1);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setTransparency(value);
    this.draw_pie_chart(real_id);
  }

  changeGradientPieChart(id, value){
    var real_id = id.substr(id.length - 1);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setGradient(value);
    this.draw_pie_chart(real_id);
  }

  changeGradientColorPieChart(id, value){
    var real_id = id.substr(id.length - 1);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setGradientColor(value);
    this.draw_pie_chart(real_id);
  }

  // Series de datos
  removeDataSerie(id){
    var real_id = id.substr(id.length - 1);
    this.data_series.splice(real_id, 1);
    document.getElementById("chart-data-" + real_id).remove();
  }
}

var application = new CanvasAPIApplication();

// Clase 'DataSeries' que encapsula los datos procesados del .csv
class DataSeries{
  constructor(id) {
    this.id = id;
    this.unstructured_data = '';
    this.structured_data_tags = [];
    this.structured_data_values = [];
    this.variable_tags = [];
    this.variable_values = [];
    this.number_of_variables = 0;
    this.title = '';
  }

  getId(){
    return this.id;
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
      
      if(parseFloat(aux_value) % 1 === 0 && aux_value.indexOf('.') != -1){
        aux_value = aux_value.substring(0, aux_value.indexOf('.'));
      }

      this.setStructuredDataValues(i, aux_value);
    }
  }

  // Funciones auxiliares para gráficas
  getMaxSerieValue() {
    return Math.max.apply(null, this.getStructuredDataValues());
  }
}

// Clase 'Chart'
class Chart{
  /* Atributos de instancia */
  static MAX_NORMAL_WIDTH = 700;
  static HEIGHT = 400;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    this.id = id;
    this.data_serie = data_serie;
    this.letter_font = letter_font;
    this.colors = []; // Colores de las correspondientes secciones
    this.sectionColor = 'white';
    this.previousSectionColor = 'white';
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.lineCap = 'butt';
    this.shadows = false;
    this.transparency = 1.0;
    this.gradient = 0.0;
    this.gradientColor = '#ffffff';
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

  getColors(){
    return this.colors;
  }

  getStrokeStyle(){
    return this.strokeStyle;
  }

  getLineWidth(){
    return this.lineWidth;
  }

  getLineCap(){
    return this.lineCap;
  }

  getShadows(){
    return this.shadows;
  }

  getTransparency(){
    return this.transparency;
  }

  getGradient(){
    return this.gradient;
  }

  getGradientColor(){
    return this.gradientColor;
  }

  setColors(){
    for(var i = 0; i < this.data_serie.getStructuredDataValues().length; i++)
      this.colors[i] = this.getSectionColor();
  }

  setStrokeStyle(strokeStyle){
    this.strokeStyle = strokeStyle;
  }

  setLineWidth(lineWidth){
    this.lineWidth = lineWidth;
  }

  setLineCap(lineCap){
    this.lineCap = lineCap;
  }

  setShadows(){
    this.shadows = !this.shadows;
  }

  setTransparency(transparency){
    this.transparency = transparency;
  }

  setGradient(gradient){
    this.gradient = gradient;
  }

  setGradientColor(value){
    this.gradientColor = value;
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
    "    <h3>Título: " + this.data_serie.getTitle() + "</h3>" +
    "    <hr class=\"solid\">" +
    "    <p><b>Criterios de selección usados:</b>"+ this.data_serie.getNumberOfVariables() +"</p>";
  
    for(var i = 0; i <this.data_serie.getNumberOfVariables(); i++){
      new_content += "<p><u>Criterio de selección " + (i+1) + " (" + this.data_serie.getVariableTags()[i] + "):</u> " + this.data_serie.getVariableValues()[i] + "</p>";
    }
  
    new_content += "<canvas id=\"" + this.getChartType()  + "-chart-" + this.data_serie.getId() + "\"></canvas>";

    if(this.getChartType() === "bar"){ // Opciones de los 'BarCharts'

      new_content += "<div class=\"options-panel-chart\">";
      new_content += "<h3>Options</h3>";
      new_content += "<hr class=\"solid\">";

      // BarChart: 'Opciones de LineWidth'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Line width</h5>";
      new_content += "<input type=\"range\" id=\"bar-linewidth-" + this.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
      + "onchange=\"application.changeLineWidthBarChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de LineCap'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Line cap</h5>";
      new_content += "<select id=\"bar-linecap-" + this.getId() + "\" onchange=\"application.changeLineCapBarChart(this.id, this.value)\">";
      new_content += "<option value=\"butt\" selected>Butt</option>";
      new_content += "<option value=\"round\">Round</option>";
      new_content += "<option value=\"square\">Square</option>";
      new_content += "</select>";
      new_content += "</div>";

      // BarChart: 'Opciones de Shadows'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Shadows</h5>";
      new_content += "<input type=\"checkbox\" id=\"bar-shadows-" + this.getId() + "\""
      + "onchange=\"application.changeShadowsBarChart(this.id)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Transparency'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Opacity</h5>";
      new_content += "<input type=\"range\" id=\"bar-transparency-" + this.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
      + "value=\"1.0\" onchange=\"application.changeTransparencyBarChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Gradiente'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Gradient</h5>";
      new_content += "<input type=\"range\" id=\"bar-gradient-" + this.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
      + "value=\"0.0\" onchange=\"application.changeGradientBarChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Color del Gradiente'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Gradient Color</h5>";
      new_content += "<input type=\"color\" id=\"bar-color-gradient-" + this.getId() + "\" "
      + "value=\"#ffffff\" onchange=\"application.changeGradientColorBarChart(this.id, this.value)\">";
      new_content += "</div>";
    } else if(this.getChartType() === "line"){ // Opciones de los 'LineCharts'

      new_content += "<div class=\"options-panel-chart\">";
      new_content += "<h3>Options</h3>";
      new_content += "<hr class=\"solid\">";

      // BarChart: 'Opciones de LineWidth'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Line width</h5>";
      new_content += "<input type=\"range\" id=\"line-linewidth-" + this.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
      + "onchange=\"application.changeLineWidthLineChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de LineCap'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Line cap</h5>";
      new_content += "<select id=\"line-linecap-" + this.getId() + "\" onchange=\"application.changeLineCapLineChart(this.id, this.value)\">";
      new_content += "<option value=\"butt\" selected>Butt</option>";
      new_content += "<option value=\"round\">Round</option>";
      new_content += "<option value=\"square\">Square</option>";
      new_content += "</select>";
      new_content += "</div>";

      // BarChart: 'Opciones de Shadows'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Shadows</h5>";
      new_content += "<input type=\"checkbox\" id=\"line-shadows-" + this.getId() + "\""
      + "onchange=\"application.changeShadowsLineChart(this.id)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Transparency'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Opacity</h5>";
      new_content += "<input type=\"range\" id=\"line-transparency-" + this.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
      + "value=\"1.0\" onchange=\"application.changeTransparencyLineChart(this.id, this.value)\">";
      new_content += "</div>";
    } else if(this.getChartType() === "pie"){ // Opciones de los 'PieCharts'
 
      new_content += "<div class=\"options-panel-chart\">";
      new_content += "<h3>Options</h3>";

      // BarChart: 'Opciones de LineWidth'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Line width</h5>";
      new_content += "<input type=\"range\" id=\"pie-linewidth-" + this.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
      + "onchange=\"application.changeLineWidthPieChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Shadows'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Shadows</h5>";
      new_content += "<input type=\"checkbox\" id=\"pie-shadows-" + this.getId() + "\""
      + "onchange=\"application.changeShadowsPieChart(this.id)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Transparency'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Opacity</h5>";
      new_content += "<input type=\"range\" id=\"pie-transparency-" + this.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
      + "value=\"1.0\" onchange=\"application.changeTransparencyPieChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Gradiente'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Gradient</h5>";
      new_content += "<input type=\"range\" id=\"pie-gradient-" + this.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
      + "value=\"0.0\" onchange=\"application.changeGradientPieChart(this.id, this.value)\">";
      new_content += "</div>";

      // BarChart: 'Opciones de Color del Gradiente'
      new_content += "<div class=\"content-options\">";
      new_content += "<h5>Gradient Color</h5>";
      new_content += "<input type=\"color\" id=\"pie-color-gradient-" + this.getId() + "\" "
      + "value=\"#ffffff\" onchange=\"application.changeGradientColorPieChart(this.id, this.value)\">";
      new_content += "</div>";
    }

    new_content += "</div></div>";
  
    document.getElementById(this.getChartType()  + "-charts-content").innerHTML += new_content;
    document.getElementById(this.getChartType()  + "-chart-" + this.data_serie.getId()).width = this.getWidth().toString();
    document.getElementById(this.getChartType()  + "-chart-" + this.data_serie.getId()).height = Chart.HEIGHT.toString();
  }
}

class BarChart extends Chart{
  /* Atributos de clase */
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 10;
  static PADDING_BOTTOM = 30;

  static BARS_MARGIN = 5;
  static SPACE_BETWEEN_BARS = 5;
  static MAX_SCALE_FACTOR_X = 1.25;
  static MAX_SCALE_FACTOR_Y = 0.75;
  static MAX_NUMBER_OF_VERTICAL_LINES = 10;
  static MIN_NUMBER_OF_VERTICAL_LINES = 3;
  static VERTICAL_LINES_WIDTH = 5;
  static VERTICAL_LINES_RATIO = 1.0/(BarChart.MAX_NUMBER_OF_VERTICAL_LINES - BarChart.MIN_NUMBER_OF_VERTICAL_LINES)

  static LETTERS_MARGIN_LEFT = 10;
  static LETTERS_MARGIN_TOP = 15;
  static LETTERS_MARGIN_BOTTOM = 5;
  static LETTER_BAR_WIDTH_FACTOR = 1.25;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, letter_value_size, letter_tag_size, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);

    this.scale_factor_y = ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM) * BarChart.MAX_SCALE_FACTOR_Y)/data_serie.getMaxSerieValue();
    this.max_value_graph = data_serie.getMaxSerieValue()/BarChart.MAX_SCALE_FACTOR_Y;
    
    var letter_value_width = letter_value_size*BarChart.LETTER_BAR_WIDTH_FACTOR;
    var letter_tag_width = letter_tag_size*BarChart.LETTER_BAR_WIDTH_FACTOR;

    this.bar_width = Math.max(letter_value_width, letter_tag_width);

    this.width = BarChart.MAX_SCALE_FACTOR_X*
      Math.max((Math.ceil(BarChart.PADDING_LEFT + BarChart.BARS_MARGIN + (this.bar_width + BarChart.SPACE_BETWEEN_BARS)*data_serie.getStructuredDataValues().length)),
      Chart.MAX_NORMAL_WIDTH);

    var logMaxValue = Math.log10(data_serie.getMaxSerieValue());

    if(logMaxValue >= 2.0)
      this.number_of_vertical_lines = BarChart.MIN_NUMBER_OF_VERTICAL_LINES;
    else if(logMaxValue <= 1.0)
      this.number_of_vertical_lines = BarChart.MAX_NUMBER_OF_VERTICAL_LINES;
    else{
      
      while(logMaxValue >= 1.0)
        logMaxValue -= 1.0;

      if(logMaxValue >= 0.0 && logMaxValue <= BarChart.VERTICAL_LINES_RATIO){
        this.number_of_vertical_lines = 4;
      } else if(logMaxValue >= BarChart.VERTICAL_LINES_RATIO && logMaxValue <= BarChart.VERTICAL_LINES_RATIO*2) {
        this.number_of_vertical_lines = 5;
      } else if(logMaxValue >= BarChart.VERTICAL_LINES_RATIO*2 && logMaxValue <= BarChart.VERTICAL_LINES_RATIO*3) {
        this.number_of_vertical_lines = 6;
      } else if(logMaxValue >= BarChart.VERTICAL_LINES_RATIO*3 && logMaxValue <= BarChart.VERTICAL_LINES_RATIO*4) {
        this.number_of_vertical_lines = 7;
      } else if(logMaxValue >= BarChart.VERTICAL_LINES_RATIO*4 && logMaxValue <= BarChart.VERTICAL_LINES_RATIO*5) {
        this.number_of_vertical_lines = 8;
      } else if(logMaxValue >= BarChart.VERTICAL_LINES_RATIO*5 && logMaxValue <= BarChart.VERTICAL_LINES_RATIO*6) {
        this.number_of_vertical_lines = 9;
      }
    }
  }

  /* Métodos */
  getChartType(){
    return 'bar';
  }

  getWidth(){
    return this.width;
  }

  getScaleFactorY(){
    return this.scale_factor_y;
  }

  getNumberOfVerticalLines(){
    return this.number_of_vertical_lines;
  }

  getMaxValueChart(){
    return this.max_value_graph;
  }
}

class LineChart extends Chart{
  /* Atributos de clase */
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 10;
  static PADDING_BOTTOM = 30;

  static LINES_MARGIN = 30;
  static SPACE_BETWEEN_POINTS = 50;
  static MAX_SCALE_FACTOR_X = 1.25;
  static MAX_SCALE_FACTOR_Y = 0.75;
  static MAX_NUMBER_OF_VERTICAL_LINES = 10;
  static MIN_NUMBER_OF_VERTICAL_LINES = 3;
  static VERTICAL_LINES_WIDTH = 5;
  static VERTICAL_LINES_RATIO = 1.0/(BarChart.MAX_NUMBER_OF_VERTICAL_LINES - BarChart.MIN_NUMBER_OF_VERTICAL_LINES)

  static LETTERS_MARGIN_LEFT = 10;
  static LETTERS_MARGIN_TOP = 15;
  static LETTERS_MARGIN_BOTTOM = 5;
  static LETTER_BAR_WIDTH_FACTOR = 1.25;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);

    this.scale_factor_y = ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM) * LineChart.MAX_SCALE_FACTOR_Y)/data_serie.getMaxSerieValue();
    this.max_value_graph = data_serie.getMaxSerieValue()/LineChart.MAX_SCALE_FACTOR_Y;

    this.width = LineChart.MAX_SCALE_FACTOR_X*
      Math.max((Math.ceil(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN + LineChart.SPACE_BETWEEN_POINTS*data_serie.getStructuredDataValues().length)),
      Chart.MAX_NORMAL_WIDTH);

    var logMaxValue = Math.log10(data_serie.getMaxSerieValue());

    if(logMaxValue >= 2.0)
      this.number_of_vertical_lines = LineChart.MIN_NUMBER_OF_VERTICAL_LINES;
    else if(logMaxValue <= 1.0)
      this.number_of_vertical_lines = LineChart.MAX_NUMBER_OF_VERTICAL_LINES;
    else{
      
      while(logMaxValue >= 1.0)
        logMaxValue -= 1.0;

      if(logMaxValue >= 0.0 && logMaxValue <= LineChart.VERTICAL_LINES_RATIO){
        this.number_of_vertical_lines = 4;
      } else if(logMaxValue >= LineChart.VERTICAL_LINES_RATIO && logMaxValue <= LineChart.VERTICAL_LINES_RATIO*2) {
        this.number_of_vertical_lines = 5;
      } else if(logMaxValue >= LineChart.VERTICAL_LINES_RATIO*2 && logMaxValue <= LineChart.VERTICAL_LINES_RATIO*3) {
        this.number_of_vertical_lines = 6;
      } else if(logMaxValue >= LineChart.VERTICAL_LINES_RATIO*3 && logMaxValue <= LineChart.VERTICAL_LINES_RATIO*4) {
        this.number_of_vertical_lines = 7;
      } else if(logMaxValue >= LineChart.VERTICAL_LINES_RATIO*4 && logMaxValue <= LineChart.VERTICAL_LINES_RATIO*5) {
        this.number_of_vertical_lines = 8;
      } else if(logMaxValue >= LineChart.VERTICAL_LINES_RATIO*5 && logMaxValue <= LineChart.VERTICAL_LINES_RATIO*6) {
        this.number_of_vertical_lines = 9;
      }
    }
  }

  /* Métodos */
  getChartType(){
    return 'line';
  }

  getWidth(){
    return this.width;
  }

  getScaleFactorY(){
    return this.scale_factor_y;
  }

  getNumberOfVerticalLines(){
    return this.number_of_vertical_lines;
  }

  getMaxValueChart(){
    return this.max_value_graph;
  }
}


class PieChart extends Chart{
  /* Atributos de clase */
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 10;
  static PADDING_BOTTOM = 30;

  static X_CENTER = 300;
  static Y_CENTER = 225;
  static BIG_RADIO = 175;
  static RADIO = 125;
  static SMALL_RADIO = 75;
  static SMALL_GRADIENT_RADIO = 50;

  /* Atributos de instancia */
  constructor(id, data_serie, letter_font, strokeStyle, lineWidth) {
    super(id, data_serie, letter_font, strokeStyle, lineWidth);

    this.width = Chart.MAX_NORMAL_WIDTH;
  }

  /* Métodos */
  getChartType(){
    return 'pie';
  }

  getWidth(){
    return this.width;
  }
}



