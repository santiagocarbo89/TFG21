class APICanvasApplication {
  constructor(){
    this.canvas;
    this.ctx;

    this.fileReader = new FileReader();

    this.fileReader.onload = function() {
      document.getElementById("title-textbox").style.display = "block";
    }

    this.data_series = [];
    this.bar_charts = [];
    this.bar_charts_to_draw = [];
    this.line_charts = [];
    this.line_charts_to_draw = [];
    this.pie_charts = [];
    this.pie_charts_to_draw = [];

    this.data_serie_next_id = 0;
    this.bar_chart_next_id = 0;
    this.line_chart_next_id = 0;
    this.pie_chart_next_id = 0;
  }

  start(){
    this.drawLogo();
  }

  showHome(){
    document.getElementById("home").style.display = "block";
    document.getElementById("add-graph-menu").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
  }

  showData(){
    document.getElementById("home").style.display = "none";
    document.getElementById("add-graph-menu").style.display = "none";
    document.getElementById("data").style.display = "block";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
  }

  showContact(){
    document.getElementById("home").style.display = "none";
    document.getElementById("add-graph-menu").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "block";
    document.getElementById("about").style.display = "none";
  }

  showAbout(){
    document.getElementById("home").style.display = "none";
    document.getElementById("add-graph-menu").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "block";
  }

  showAddGraphMenu(){
    var add_graph_menu = document.getElementById("add-graph-menu");
    var add_graph_menu_display = window.getComputedStyle(add_graph_menu).display;

    if(add_graph_menu_display == "none")
      add_graph_menu.style.display = "block";
    else if(add_graph_menu_display == "block")
      add_graph_menu.style.display = "none";
  }

  showOptions(id){
    var real_id = id.substring(0, id.indexOf("-")) + "-chart-options-" + id.substring(id.length - 1);
    var options_button = document.getElementById(real_id);
    var options_button_display = window.getComputedStyle(options_button).display;

    if(options_button_display == "none")
      options_button.style.display = "block";
    else if(options_button_display == "block")
      options_button.style.display = "none";
  }

  selectFile(){
    var insert_file = document.getElementById("insert-file");
  
    if(insert_file)
      insert_file.click();
  }

  insertManager(file){
    if(file.length > 1)
      alert("Selecciones un solo archivo, por favor.");

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
      alert("Suelte un solo archivo, por favor.");
    }else
      event.dataTransfer.clearData()
  }

  dragoverManager(event) {
    event.preventDefault();
  }

  submitDataSerie(event){
    event.preventDefault();

    var title = document.getElementsByName('title')[0].value;
    document.getElementById('title').value = '';
    var submit_serie = true;

    for(var i = 0; i < this.data_series.length; i++){
      if(this.data_series[i].getTitle() == title)
        submit_serie = false;
    }

    if(submit_serie){
      var file = this.fileReader.result;
      document.getElementById("insert-file").value = "";
      var data_series = document.getElementById("data-series");

      if(data_series === null)
        document.getElementById("data").insertAdjacentHTML("beforeend", "<div id=\"data-series\"></div>");

      var chart_data = new DataSerie(this.data_serie_next_id++);
      chart_data.setTitle(title);
      chart_data.setUnstructuredData(file);
      chart_data.structureData();

      this.data_series.push(chart_data);

      document.getElementById("title-textbox").style.display = "none";
      document.getElementById("file-loaded").style.display = "none";

      var new_content = 
      "<div class=\"data-serie-content\" id=\"data-serie-" + chart_data.getId() + "\">" +
      "    <button class=\"remove-serie-button\" id=\"remove-serie-button-" + chart_data.getId() + "\" onclick=\"application.removeDataSerie(this.id)\">Eliminar serie de datos</button>" +
      "    <h3>Título:  " + this.data_series[this.data_series.length-1].getTitle() + "</h3>" +
      "    <hr class=\"solid\">" +
      "    <p><b>Criterios de selección usados:</b> "+ this.data_series[this.data_series.length-1].getNumberOfVariables() +"</p>";
  
      for(var i = 0; i < this.data_series[this.data_series.length-1].getNumberOfVariables(); i++){
        new_content += "<p><u>Criterio de selección " + (i+1) + " (" + this.data_series[this.data_series.length-1].getVariableTags()[i] + "):</u> " + this.data_series[this.data_series.length-1].getVariableValues()[i] + "</p>";
      }
  
      new_content += "</div>";
      document.getElementById("data-series").insertAdjacentHTML("beforeend", new_content);

      var select_data_serie = document.getElementById("select-data-serie");
      var option = document.createElement("option");
      option.text = title;
      option.value = "data-serie-" + chart_data.getId();
      select_data_serie.add(option);
    } else
      alert("El título ya existe. Por favor, escoja otro.");
  }

  dataSerieHasAssociatedCharts(real_id){
    var associated_charts = false;

    for(var i = 0; i < this.bar_charts.length && !associated_charts; i++){
      if(this.bar_charts[i].getId() == real_id)
        associated_charts = true;
    }

    for(var i = 0; i < this.line_charts.length && !associated_charts; i++){
      if(this.line_charts[i].getId() == real_id)
        associated_charts = true;
    }

    for(var i = 0; i < this.pie_charts.length && !associated_charts; i++){
      if(this.pie_charts[i].getId() == real_id)
        associated_charts = true;
    }

    return associated_charts;
  }

  removeDataSerie(id){
    var real_id = id.substring(id.length - 1);

    if(!this.dataSerieHasAssociatedCharts(real_id)){

      var select_data_serie = document.getElementById("select-data-serie");
      var loop = true;

      for(var i = 0; i < select_data_serie.options.length && loop; i++){
        for(var j = 0; j < this.data_series.length; j++){
          if(select_data_serie.options[i].text == this.data_series[j].getTitle()){
            select_data_serie.remove(i);
            document.getElementById("data-serie-" + this.data_series[j].getId()).remove();
            this.data_series.splice(j, 1);
            loop = false;
          }
        }
      }
    } else
      alert("Existen gráficas asociadas con la serie de datos. Por favor, elimine previamente las gráficas.");

    if(this.data_series.length == 0)
      document.getElementById("data-series").remove();
  }

  submitChart(){
    var select_data_serie = document.getElementById("select-data-serie");
    var select_chart_type = document.getElementById("select-chart-type");

    if(select_data_serie.value == "none" && select_chart_type.value == "none"){
      alert("Seleccione una serie datos, por favor.");
    } else if(select_chart_type.value == "none"){
      alert("Seleccione un tipo de gráfica, por favor");
    } else if(select_data_serie.value == "none"){
      alert("Seleccione una serie de datos y un tipo de gráfica, por favor");
    } else{

      var chart_data;

      for(var i = 0; i < this.data_series.length; i++){
        if(this.data_series[i].getTitle() == select_data_serie.options[select_data_serie.selectedIndex].text)
          chart_data = this.data_series[i];
      }

      var check_select = document.getElementById("charts-" + chart_data.getId());
      var same_option = false;

      if(check_select !== null){
        for(var i = 0; i < check_select.options.length; i++){
          if(check_select.options[i].value == select_chart_type.options[select_chart_type.selectedIndex].value)
            same_option = true;
        }
      }

      if(select_chart_type.value == "bar"){

        var bar_chart = new BarChart(this.bar_chart_next_id++, chart_data);
        bar_chart.setColors();

        if(!same_option){
          this.bar_charts.push(bar_chart);

          if(bar_chart.insertChartData())
            this.bar_charts_to_draw.push(bar_chart.getId());

          document.getElementById("select-data-serie").selectedIndex = 0;
          document.getElementById("select-chart-type").selectedIndex = 0;
          document.getElementById("add-graph-menu").style.display = "none";
        } else
          alert("La gráfica seleccionada ya existe.");
        
      } else if(select_chart_type.value == "line"){
        var line_chart = new LineChart(this.line_chart_next_id++, chart_data);

        if(!same_option){
          this.line_charts.push(line_chart);

          if(line_chart.insertChartData())
            this.line_charts_to_draw.push(line_chart.getId());

          document.getElementById("select-data-serie").selectedIndex = 0;
          document.getElementById("select-chart-type").selectedIndex = 0;
          document.getElementById("add-graph-menu").style.display = "none";
        } else
          alert("La gráfica seleccionada ya existe.");
      } else if(select_chart_type.value == "pie"){
        var pie_chart = new PieChart(this.pie_chart_next_id++, chart_data);
        pie_chart.setColors();

        if(!same_option){
          this.pie_charts.push(pie_chart);

          if(pie_chart.insertChartData())
            this.pie_charts_to_draw.push(pie_chart.getId());
          
          document.getElementById("select-data-serie").selectedIndex = 0;
          document.getElementById("select-chart-type").selectedIndex = 0;
          document.getElementById("add-graph-menu").style.display = "none";
        } else
          alert("La gráfica seleccionada ya existe.");
      }
    }

    this.drawCharts();
  }

  changeChartVisualized(id, value){
    var id_data_serie = id.substring(id.length - 1);

    var array_in;
    var array_in_to_draw;
    var array_out1;
    var array_out1_to_draw;
    var array_out2;
    var array_out2_to_draw;
    var another_chart1;
    var another_chart2;
    var another_buttom1;
    var another_buttom2;
    var another_options1;
    var another_options2;
    var another_options_button1;
    var another_options_button2;

    if(value == "bar"){
      array_in = this.bar_charts;
      array_in_to_draw = this.bar_charts_to_draw;
      array_out1 = this.line_charts;
      array_out1_to_draw = this.line_charts_to_draw;
      array_out2 = this.pie_charts;
      array_out2_to_draw = this.pie_charts_to_draw;
      another_chart1 = document.getElementById("line-chart-" + id_data_serie);
      another_chart2 = document.getElementById("pie-chart-" + id_data_serie);
      another_buttom1 = document.getElementById("remove-line-chart-button-" + id_data_serie);
      another_buttom2 = document.getElementById("remove-pie-chart-button-" + id_data_serie);
      another_options1 = document.getElementById("line-chart-options-" + id_data_serie);
      another_options2 = document.getElementById("pie-chart-options-" + id_data_serie);
      another_options_button1 = document.getElementById("line-options-buttons-" + id_data_serie);
      another_options_button2 = document.getElementById("pie-options-buttons-" + id_data_serie);
      
    } else if(value == "line"){
      array_in = this.line_charts;
      array_in_to_draw = this.line_charts_to_draw;
      array_out1 = this.bar_charts;
      array_out1_to_draw = this.bar_charts_to_draw;
      array_out2 = this.pie_charts;
      array_out2_to_draw = this.pie_charts_to_draw;
      another_chart1 = document.getElementById("bar-chart-" + id_data_serie);
      another_chart2 = document.getElementById("pie-chart-" + id_data_serie);
      another_buttom1 = document.getElementById("remove-bar-chart-button-" + id_data_serie);
      another_buttom2 = document.getElementById("remove-pie-chart-button-" + id_data_serie);
      another_options1 = document.getElementById("bar-chart-options-" + id_data_serie);
      another_options2 = document.getElementById("pie-chart-options-" + id_data_serie);
      another_options_button1 = document.getElementById("bar-options-buttons-" + id_data_serie);
      another_options_button2 = document.getElementById("pie-options-buttons-" + id_data_serie);

    } else if(value == "pie"){
      array_in = this.pie_charts;
      array_in_to_draw = this.pie_charts_to_draw;
      array_out1 = this.line_charts;
      array_out1_to_draw = this.line_charts_to_draw;
      array_out2 = this.bar_charts;
      array_out2_to_draw = this.bar_charts_to_draw;
      another_chart1 = document.getElementById("line-chart-" + id_data_serie);
      another_chart2 = document.getElementById("bar-chart-" + id_data_serie);
      another_buttom1 = document.getElementById("remove-bar-chart-button-" + id_data_serie);
      another_buttom2 = document.getElementById("remove-line-chart-button-" + id_data_serie);
      another_options1 = document.getElementById("bar-chart-options-" + id_data_serie);
      another_options2 = document.getElementById("line-chart-options-" + id_data_serie);
      another_options_button1 = document.getElementById("bar-options-buttons-" + id_data_serie);
      another_options_button2 = document.getElementById("line-options-buttons-" + id_data_serie);
    }


    for(var i = 0; i < array_in.length; i++){
      if(array_in[i].getDataSerie().getId() == id_data_serie)
        array_in_to_draw.push(array_in[i].getId());
    }

    for(var i = 0; i < array_out1.length; i++){
      for(var j = 0; j < array_out1_to_draw.length; j++){
        if(array_out1[i].getId() == array_out1_to_draw[j] 
        && array_out1[i].getDataSerie().getId() == id_data_serie)
          array_out1_to_draw.splice(j, 1);
      }
    }

    for(var i = 0; i < array_out2.length; i++){
      for(var j = 0; j < array_out2_to_draw.length; j++){
        if(array_out2[i].getId() == array_out2_to_draw[j] 
        && array_out2[i].getDataSerie().getId() == id_data_serie)
          array_out2_to_draw.splice(j, 1);
      }
    }

    if(another_chart1 !== null)
      another_chart1.style.display = "none";

    if(another_chart2 !== null)
      another_chart2.style.display = "none";

    if(another_buttom1 !== null)
      another_buttom1.style.display = "none";

    if(another_buttom2 !== null)
      another_buttom2.style.display = "none";

    if(another_options1 !== null)
      another_options1.style.display = "none";

    if(another_options2 !== null)
      another_options2.style.display = "none";

    if(another_options_button1 !== null)
      another_options_button1.style.display = "none";

    if(another_options_button2 !== null)
      another_options_button2.style.display = "none";

    document.getElementById(value + "-chart-" + id_data_serie).style.display = "block";
    document.getElementById("remove-" + value + "-chart-button-" + id_data_serie).style.display = "block";
    document.getElementById(value + "-chart-options-" + id_data_serie).style.display = "none";
    document.getElementById(value + "-options-buttons-" + id_data_serie).style.display = "block";

    this.drawCharts();
  }

  removeChart(id){
    var real_id = id.substring(id.length - 1);
    var aux_string = id.substring(id.indexOf("-") + 1);
    var chart_type = aux_string.substring(0, aux_string.indexOf("-"));
    var select_charts = document.getElementById("charts-" + real_id);
    var charts_vector;
    var charts_vector_to_draw;
    var chart_vector_id = -1;

    if(chart_type == "bar"){
      charts_vector = this.bar_charts;
      charts_vector_to_draw = this.bar_charts_to_draw;
    }
    else if(chart_type == "line"){
      charts_vector = this.line_charts;
      charts_vector_to_draw = this.line_charts_to_draw;
    }
    else if(chart_type == "pie"){
      charts_vector = this.pie_charts;
      charts_vector_to_draw = this.pie_charts_to_draw;
    }

    for(var i = 0; i < charts_vector.length; i++){
      if(charts_vector[i].getDataSerie().getId() == real_id){
        chart_vector_id = charts_vector[i].getId();
        charts_vector.splice(i, 1);
      }
    }

    if(chart_vector_id != -1){
      for(var i = 0; i < charts_vector_to_draw.length; i++){
        if(charts_vector_to_draw[i] == chart_vector_id)
          charts_vector_to_draw.splice(i, 1);
      }
    }

    if(select_charts.options.length > 1){
      document.getElementById(chart_type + "-chart-" + real_id).remove();
      select_charts.remove(select_charts.selectedIndex);
      document.getElementById("remove-" + chart_type + "-chart-button-" + real_id).remove();
      document.getElementById(chart_type + "-options-buttons-" + real_id).remove();
      this.changeChartVisualized("charts-" + real_id, select_charts.options[select_charts.selectedIndex].value);
    } else {
      document.getElementById("whole-chart-content-" + real_id).remove();
    }

    this.drawCharts();
  }
  
  drawLogo(){
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

  drawCharts(){
    for(var i = 0; i < this.bar_charts.length; i++){
      for(var j = 0; j < this.bar_charts_to_draw.length; j++){
        if(this.bar_charts[i].getId() == this.bar_charts_to_draw[j])
          this.drawBarChart(i);
      }
    }

    for(var i = 0; i < this.line_charts.length; i++){
      for(var j = 0; j < this.line_charts_to_draw.length; j++){
        if(this.line_charts[i].getId() == this.line_charts_to_draw[j])
          this.drawLineChart(i);
      }
    }

    for(var i = 0; i < this.pie_charts.length; i++){
      for(var j = 0; j < this.pie_charts_to_draw.length; j++){
        if(this.pie_charts[i].getId() == this.pie_charts_to_draw[j])
          this.drawPieChart(i);
      }
    }
  }

  drawBarChart(id){
    var bar_chart = this.bar_charts[id];
    var data_serie = bar_chart.getDataSerie();
    var data_serie_id = data_serie.getId();
    var chart_id = "bar-chart-" + data_serie_id;
    this.canvas = document.getElementById(chart_id);
    var canvas_context = this.canvas.getContext;
  
    if(canvas_context) {
      this.ctx = this.canvas.getContext('2d');
      var canvas_width = this.canvas.width;
      var canvas_height = this.canvas.height;
      this.ctx.clearRect(0, 0, canvas_width, canvas_height);
    }

    this.ctx.strokeStyle = bar_chart.getStrokeStyle();
    this.ctx.lineWidth = bar_chart.getLineWidth();
    this.ctx.font = bar_chart.getLetterHeight() + "px " + bar_chart.getLetterFont();
    this.ctx.globalAlpha = bar_chart.getTransparency();

    var number_tag;

    for(var j = 0; j < bar_chart.getNumberOfVerticalLines(); j++){

      if(bar_chart.getScale() == "linear")
        number_tag = bar_chart.getMaxValueLinearChart()*(j/(bar_chart.getNumberOfVerticalLines() - 1));
      else if(bar_chart.getScale() == "logarithmic"){
        number_tag = (bar_chart.getMaxValueLogarithmicChart()*Math.log(((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)*(j/(bar_chart.getNumberOfVerticalLines() - 1))) + Math.exp(BarChart.LOG_MARGIN)))/Math.log(Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM);
        number_tag = number_tag.toFixed(1);
      }

      if(number_tag.toString().length <= BarChart.MAX_NUMBER_OF_DIGITS){
        bar_chart.setStrokeStyle('black');
        this.ctx.strokeStyle = bar_chart.getStrokeStyle();

        this.ctx.beginPath();
        this.ctx.moveTo(BarChart.PADDING_LEFT - BarChart.VERTICAL_LINES_WIDTH,
          BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*(bar_chart.getNumberOfVerticalLines() - j - 1));

        this.ctx.lineTo(BarChart.PADDING_LEFT, 
          BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*(bar_chart.getNumberOfVerticalLines() - j - 1));

        this.ctx.stroke();
      }

      bar_chart.setStrokeStyle('#e5e4e2');
      this.ctx.strokeStyle = bar_chart.getStrokeStyle();

      this.ctx.beginPath();
      this.ctx.moveTo(BarChart.PADDING_LEFT, 
        BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*(bar_chart.getNumberOfVerticalLines() - j - 1));
  
      this.ctx.lineTo(Chart.WIDTH - BarChart.PADDING_RIGHT,
        BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*(bar_chart.getNumberOfVerticalLines() - j - 1));

      this.ctx.stroke();

      if(number_tag.toString().length <= BarChart.MAX_NUMBER_OF_DIGITS){
        this.ctx.fillText(number_tag.toString(), BarChart.LETTERS_MARGIN_LEFT, 
          BarChart.PADDING_TOP + ((Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/(bar_chart.getNumberOfVerticalLines()-1))*(bar_chart.getNumberOfVerticalLines() - j - 1));
      }
    }

    bar_chart.setStrokeStyle('black');
    this.ctx.strokeStyle = bar_chart.getStrokeStyle();

    this.ctx.beginPath();
    this.ctx.moveTo(BarChart.PADDING_LEFT, BarChart.PADDING_TOP);
    this.ctx.lineTo(BarChart.PADDING_LEFT, Chart.HEIGHT - BarChart.PADDING_BOTTOM);
    this.ctx.lineTo(Chart.WIDTH - BarChart.PADDING_RIGHT, Chart.HEIGHT - BarChart.PADDING_BOTTOM);
    this.ctx.stroke();

    if(bar_chart.checkWidthLimit(bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())){

      bar_chart.setVisibleValues();

      var aux_modifications;
      var keep_optimizing_space = true;

      while(keep_optimizing_space){

        if(bar_chart.getSpaceBetweenBars() > 0.0
            && bar_chart.checkWidthLimit(bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())){        
          aux_modifications = bar_chart.getSpaceBetweenBars() - 0.1;
          bar_chart.setSpaceBetweenBars(aux_modifications);
        } else
          keep_optimizing_space = false;
      }

      var keep_optimizing_bar_width = true;
      var min_bar_width = bar_chart.getBarWidth()/2;

      while(keep_optimizing_bar_width){

        if(bar_chart.getBarWidth() > min_bar_width
            && bar_chart.checkWidthLimit(bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())){        
              aux_modifications = bar_chart.getBarWidth() - 0.1;
              bar_chart.setBarWidth(aux_modifications);
        } else
          keep_optimizing_bar_width = false;
      }
  
      var keep_optimizing_letters = true;

      while(keep_optimizing_letters){

        if(bar_chart.getLetterHeight() > Chart.MIN_FONT){
          aux_modifications = bar_chart.getLetterHeight() - 0.2;
          bar_chart.setLetterHeight(aux_modifications);
          this.ctx.font = bar_chart.getLetterHeight() + "px " + bar_chart.getLetterFont();
          bar_chart.setLetterValueWidth(this.ctx.measureText(data_serie.getMaxSerieValue().toString()).width);
          bar_chart.setLetterTagWidth(this.ctx.measureText(data_serie.getStructuredDataTags()[0]).width);
        } else
          keep_optimizing_letters = false;
      }

      var keep_optimizing_letter_appearance = true;

      while(keep_optimizing_letter_appearance){
        if((bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*bar_chart.getTextAppearance() < Math.max(bar_chart.getLetterTagWidth(), bar_chart.getLetterValueWidth())){
          aux_modifications = bar_chart.getTextAppearance() + 1;
          bar_chart.setTextAppearance(aux_modifications);
        } else
          keep_optimizing_letter_appearance = false;
      }
    }

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var value = data_serie.getStructuredDataValues()[j];
      var x0 = BarChart.PADDING_LEFT + BarChart.BARS_MARGIN + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j;

      if(bar_chart.getScale() == "linear")
        var y0 = Chart.HEIGHT - BarChart.PADDING_BOTTOM - bar_chart.getLinearScaleFactor()*value;
      else if(bar_chart.getScale() == "logarithmic")
        var y0 = Chart.HEIGHT - BarChart.PADDING_BOTTOM - Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*value);


      var x1 = x0 + bar_chart.getBarWidth();

      if(bar_chart.getScale() == "linear")
        var y1 = y0 + bar_chart.getLinearScaleFactor()*value;
      else if(bar_chart.getScale() == "logarithmic")
        var y1 = y0 + Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*value);

      if(bar_chart.getThreedEffect()){
        
        this.ctx.beginPath();

        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x0 + BarChart.THREE_D_X_DISPLACEMENT, y0 - BarChart.THREE_D_Y_DISPLACEMENT);
        this.ctx.lineTo(x1 + BarChart.THREE_D_X_DISPLACEMENT, y0 - BarChart.THREE_D_Y_DISPLACEMENT);
        this.ctx.lineTo(x1 + BarChart.THREE_D_X_DISPLACEMENT, y1 - BarChart.THREE_D_Y_DISPLACEMENT);
        this.ctx.lineTo(x1, y1);

        if(bar_chart.getShadows()){
          this.ctx.shadowOffsetX = 5;
          this.ctx.shadowOffsetY = 2;
          this.ctx.shadowBlur = 4;
          this.ctx.shadowColor = 'black';
        }

        this.ctx.fillStyle = bar_chart.getColors()[j];
        this.ctx.fill();

        if(bar_chart.getShadows()){
          this.ctx.shadowOffsetX = 0;
          this.ctx.shadowOffsetY = 0;
          this.ctx.shadowBlur = 0;
        }
      
        this.ctx.moveTo(x1, y0);
        this.ctx.lineTo(x1 + BarChart.THREE_D_X_DISPLACEMENT, y0 - BarChart.THREE_D_Y_DISPLACEMENT);

        this.ctx.stroke();
      }

      var gradient = this.ctx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(1 - bar_chart.getGradient(), bar_chart.getColors()[j]);
      gradient.addColorStop(1, bar_chart.getGradientColor());
      this.ctx.fillStyle = gradient;

      if(bar_chart.getShadows() && !bar_chart.getThreedEffect()){
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'black';
      }

      if(bar_chart.getScale() == "linear")
        this.ctx.fillRect(x0, y0, bar_chart.getBarWidth(), bar_chart.getLinearScaleFactor()*value);
      else if(bar_chart.getScale() == "logarithmic")
        this.ctx.fillRect(x0, y0, bar_chart.getBarWidth(), Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*value));

      if(bar_chart.getShadows() && !bar_chart.getThreedEffect()){
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
      }

      if(bar_chart.getScale() == "linear")
        this.ctx.strokeRect(x0, y0, bar_chart.getBarWidth(), bar_chart.getLinearScaleFactor()*value);
      else if(bar_chart.getScale() == "logarithmic")
        this.ctx.strokeRect(x0, y0, bar_chart.getBarWidth(), Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*value));
    }

    this.ctx.fillStyle = "black";
    this.ctx.font = bar_chart.getLetterHeight() + "px " + bar_chart.getLetterFont();

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j += bar_chart.getTextAppearance()){
      if(data_serie.getStructuredDataTags()[j].length <= BarChart.MAX_NUMBER_OF_DIGITS){
        this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
          (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j, 
            Chart.HEIGHT - BarChart.PADDING_BOTTOM + BarChart.LETTERS_MARGIN_TOP);
      }

      if(data_serie.getStructuredDataValues()[j].toString().length <= BarChart.MAX_NUMBER_OF_DIGITS && bar_chart.getVisibleValues()){
        if(bar_chart.getThreedEffect()){
          if(bar_chart.getScale() == "linear"){
            this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
              (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j + BarChart.THREE_D_X_DISPLACEMENT, 
                Chart.HEIGHT - BarChart.PADDING_BOTTOM - bar_chart.getLinearScaleFactor()*data_serie.getStructuredDataValues()[j] - BarChart.LETTERS_MARGIN_BOTTOM - BarChart.THREE_D_Y_DISPLACEMENT);
          } else if(bar_chart.getScale() == "logarithmic"){
            this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
              (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j + BarChart.THREE_D_X_DISPLACEMENT, 
                Chart.HEIGHT - BarChart.PADDING_BOTTOM - Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*data_serie.getStructuredDataValues()[j]) - BarChart.LETTERS_MARGIN_BOTTOM - BarChart.THREE_D_Y_DISPLACEMENT);
          }
        } else {
          if(bar_chart.getScale() == "linear"){
            this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
              (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j, 
                Chart.HEIGHT - BarChart.PADDING_BOTTOM - bar_chart.getLinearScaleFactor()*data_serie.getStructuredDataValues()[j] - BarChart.LETTERS_MARGIN_BOTTOM);
          } else if(bar_chart.getScale() == "logarithmic"){
            this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
              (BarChart.PADDING_LEFT + BarChart.BARS_MARGIN) + (bar_chart.getBarWidth() + bar_chart.getSpaceBetweenBars())*j, 
                Chart.HEIGHT - BarChart.PADDING_BOTTOM - Math.exp(BarChart.LOG_MARGIN + bar_chart.getLogarithmicScaleFactor()*data_serie.getStructuredDataValues()[j]) - BarChart.LETTERS_MARGIN_BOTTOM);
          }
        }
      }
    }
  }

  drawLineChart(id) {
    var line_chart = this.line_charts[id];
    var data_serie = line_chart.getDataSerie();
    var data_serie_id = data_serie.getId();
    var chart_id = "line-chart-" + data_serie_id;
    this.canvas = document.getElementById(chart_id);
    var canvas_context = this.canvas.getContext;

    if(canvas_context) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = line_chart.getStrokeStyle();
    this.ctx.lineWidth = line_chart.getLineWidth();
    this.ctx.font = line_chart.getLetterHeight() + "px " + line_chart.getLetterFont();
    this.ctx.globalAlpha = line_chart.getTransparency();

    var number_tag;

    for(var j = 0; j < line_chart.getNumberOfVerticalLines(); j++){

      if(line_chart.getScale() == "linear")
        number_tag = line_chart.getMaxValueLinearChart()*(j/(line_chart.getNumberOfVerticalLines() - 1));
      else if(line_chart.getScale() == "logarithmic"){
        number_tag = (line_chart.getMaxValueLogarithmicChart()*Math.log(((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)*(j/(line_chart.getNumberOfVerticalLines() - 1))) + Math.exp(LineChart.LOG_MARGIN)))/Math.log(Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM);
        number_tag = number_tag.toFixed(1);
      }
      
      if(number_tag.toString().length <= LineChart.MAX_NUMBER_OF_DIGITS){
        line_chart.setStrokeStyle('black');
        this.ctx.strokeStyle = line_chart.getStrokeStyle();
      
        this.ctx.beginPath();
        this.ctx.moveTo(LineChart.PADDING_LEFT - LineChart.VERTICAL_LINES_WIDTH,
          LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*(line_chart.getNumberOfVerticalLines() - j - 1));

        this.ctx.lineTo(LineChart.PADDING_LEFT, 
          LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*(line_chart.getNumberOfVerticalLines() - j - 1));

        this.ctx.stroke();
      }

      line_chart.setStrokeStyle('#e5e4e2');
      this.ctx.strokeStyle = line_chart.getStrokeStyle();

      this.ctx.beginPath();
      this.ctx.moveTo(LineChart.PADDING_LEFT, 
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*(line_chart.getNumberOfVerticalLines() - j - 1));
  
      this.ctx.lineTo(Chart.WIDTH - LineChart.PADDING_RIGHT,
        LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*(line_chart.getNumberOfVerticalLines() - j - 1));

      this.ctx.stroke();

      if(number_tag.toString().length <= LineChart.MAX_NUMBER_OF_DIGITS){
        this.ctx.fillText(number_tag.toString(), LineChart.LETTERS_MARGIN_LEFT, 
          LineChart.PADDING_TOP + ((Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/(line_chart.getNumberOfVerticalLines()-1))*(line_chart.getNumberOfVerticalLines() - j - 1));
      }
    }

    line_chart.setStrokeStyle('black');
    this.ctx.strokeStyle = line_chart.getStrokeStyle();

    this.ctx.beginPath();
    this.ctx.moveTo(LineChart.PADDING_LEFT, LineChart.PADDING_TOP);
    this.ctx.lineTo(LineChart.PADDING_LEFT, Chart.HEIGHT - LineChart.PADDING_BOTTOM);
    this.ctx.lineTo(Chart.WIDTH - LineChart.PADDING_RIGHT, Chart.HEIGHT - LineChart.PADDING_BOTTOM);
    this.ctx.stroke();

    if(line_chart.checkWidthLimit(line_chart.getSpaceBetweenPoints())){

      var aux_modifications;
      var keep_optimizing_points = true;

      while(keep_optimizing_points){

        if(line_chart.getSpaceBetweenPoints() > LineChart.MIN_SPACE_BETWEEN_POINTS 
          && line_chart.checkWidthLimit(line_chart.getSpaceBetweenPoints())){        
          aux_modifications = line_chart.getSpaceBetweenPoints() - 0.1;
          line_chart.setSpaceBetweenPoints(aux_modifications);
        } else
          keep_optimizing_points = false;
      }
  
      var keep_optimizing_letters = true;

      while(keep_optimizing_letters){

        if(line_chart.getLetterHeight() > Chart.MIN_FONT){
          aux_modifications = line_chart.getLetterHeight() - 0.2;
          line_chart.setLetterHeight(aux_modifications);
          this.ctx.font = line_chart.getLetterHeight() + "px " + line_chart.getLetterFont();
          line_chart.setLetterValueWidth(this.ctx.measureText(data_serie.getMaxSerieValue().toString()).width);
          line_chart.setLetterTagWidth(this.ctx.measureText(data_serie.getStructuredDataTags()[0]).width);
        } else
          keep_optimizing_letters = false;
      }

      var keep_optimizing_letter_appearance = true;

      while(keep_optimizing_letter_appearance){
        if(line_chart.getSpaceBetweenPoints()*line_chart.getTextAppearance() < 2*Math.max(line_chart.getLetterTagWidth(), line_chart.getLetterValueWidth())){
          aux_modifications = line_chart.getTextAppearance() + 1;
          line_chart.setTextAppearance(aux_modifications);
        } else
          keep_optimizing_letter_appearance = false;
      }
    }

    this.ctx.beginPath();
    
    if(line_chart.getScale() == "linear"){
      this.ctx.moveTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN, 
        Chart.HEIGHT - LineChart.PADDING_BOTTOM - data_serie.getStructuredDataValues()[0]*line_chart.getLinearScaleFactor());
    } else if(line_chart.getScale() == "logarithmic"){
      this.ctx.moveTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN, 
        Chart.HEIGHT - LineChart.PADDING_BOTTOM - Math.exp(LineChart.LOG_MARGIN + data_serie.getStructuredDataValues()[0]*line_chart.getLogarithmicScaleFactor()));
    }

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var value = data_serie.getStructuredDataValues()[j];

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

      line_chart.setStrokeStyle("#4d4d4d");
      this.ctx.strokeStyle = line_chart.getStrokeStyle();

      if(line_chart.getScale() == "linear"){
        this.ctx.lineTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN + line_chart.getSpaceBetweenPoints()*j, 
          Chart.HEIGHT - LineChart.PADDING_BOTTOM - value*line_chart.getLinearScaleFactor());
      } else if(line_chart.getScale() == "logarithmic"){
        this.ctx.lineTo(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN + line_chart.getSpaceBetweenPoints()*j, 
          Chart.HEIGHT - LineChart.PADDING_BOTTOM - Math.exp(LineChart.LOG_MARGIN + value*line_chart.getLogarithmicScaleFactor()));
      }
    }

    this.ctx.stroke();

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;

    line_chart.setStrokeStyle("black");
    this.ctx.strokeStyle = line_chart.getStrokeStyle();
    this.ctx.font = line_chart.getLetterHeight() + "px " + line_chart.getLetterFont();

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j += line_chart.getTextAppearance()){
      if(data_serie.getStructuredDataTags()[j].length <= LineChart.MAX_NUMBER_OF_DIGITS){
        this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
          (LineChart.PADDING_LEFT + LineChart.LINES_MARGIN) + line_chart.getSpaceBetweenPoints()*j, 
            Chart.HEIGHT - LineChart.PADDING_BOTTOM + LineChart.LETTERS_MARGIN_TOP);
      }

      if(data_serie.getStructuredDataValues()[j].toString().length <= LineChart.MAX_NUMBER_OF_DIGITS){
        if(line_chart.getScale() == "linear"){
          this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
            (LineChart.PADDING_LEFT + LineChart.LINES_MARGIN) + line_chart.getSpaceBetweenPoints()*j, 
              Chart.HEIGHT - LineChart.PADDING_BOTTOM - line_chart.getLinearScaleFactor()*data_serie.getStructuredDataValues()[j] - LineChart.LETTERS_MARGIN_BOTTOM);
        } else if(line_chart.getScale() == "logarithmic"){
          this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
            (LineChart.PADDING_LEFT + LineChart.LINES_MARGIN) + line_chart.getSpaceBetweenPoints()*j, 
              Chart.HEIGHT - LineChart.PADDING_BOTTOM - Math.exp(LineChart.LOG_MARGIN + line_chart.getLogarithmicScaleFactor()*data_serie.getStructuredDataValues()[j]) - LineChart.LETTERS_MARGIN_BOTTOM);
        }
      }
    }
  }

  drawPieChart(id) {
    var pie_chart = this.pie_charts[id];
    var data_serie = pie_chart.getDataSerie();
    var data_serie_id = data_serie.getId();
    var chart_id = "pie-chart-" + data_serie_id;
    this.canvas = document.getElementById(chart_id);
    var canvas_context = this.canvas.getContext;
  
    if(canvas_context) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    var totalValues = 0;

    this.ctx.lineWidth = pie_chart.getLineWidth();
    this.ctx.font = pie_chart.getLetterHeight() + "px " + pie_chart.getLetterFont();
    this.ctx.strokeStyle = pie_chart.getStrokeStyle();
    this.ctx.globalAlpha = pie_chart.getTransparency();

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      totalValues += data_serie.getStructuredDataValues()[j];
    }

    var lastAngle = 0; 

    if(pie_chart.getShadows()){
      this.ctx.shadowOffsetX = 5;
      this.ctx.shadowOffsetY = 2;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = 'black';
    }

    if(pie_chart.getThreedEffect())
      var center_x = PieChart.X_CENTER + PieChart.THREED_SHADOW_CORRECTOR;
    else
      var center_x = PieChart.X_CENTER;

    this.ctx.beginPath();

    this.ctx.fillStyle = "white";

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = data_serie.getStructuredDataValues()[j]/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;
      
      this.ctx.moveTo(center_x + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);

      this.ctx.arc(center_x + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, 
          PieChart.RADIO, lastAngle, currentAngle, false);
      
      lastAngle = currentAngle;
    }

    this.ctx.fill();

    lastAngle = 0;

    if(pie_chart.getShadows()){
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.shadowBlur = 0;
    }

    if(pie_chart.getThreedEffect()){
      this.ctx.fillStyle = "#e5e4e2";

      this.ctx.beginPath();

      this.ctx.moveTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM - PieChart.RADIO);
      this.ctx.lineTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT + PieChart.THREED_DEPTH, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM - PieChart.RADIO);
      
      this.ctx.arcTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT + PieChart.THREED_REFERENCE_X_POINT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT + PieChart.THREED_DEPTH, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM + PieChart.RADIO, PieChart.THREED_REFERENCE_RADIO);

      this.ctx.lineTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM + PieChart.RADIO);

      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = "black";
    }
      
    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = data_serie.getStructuredDataValues()[j]/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;
      
      this.ctx.beginPath();
      
      this.ctx.moveTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);

      this.ctx.arc(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, 
          PieChart.RADIO, lastAngle, currentAngle, false);
        
      this.ctx.lineTo(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
        PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
      
      var gradient = this.ctx.createRadialGradient(PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, PieChart.SMALL_GRADIENT_RADIO*pie_chart.getGradient(), 
      PieChart.X_CENTER + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM, PieChart.RADIO);

      if(pie_chart.getGradientActivated()){
        gradient.addColorStop(0, pie_chart.getGradientColor());
        gradient.addColorStop(1, pie_chart.getColors()[j]);
        this.ctx.fillStyle = gradient;
      }
      else
      this.ctx.fillStyle = pie_chart.getColors()[j];

      this.ctx.fill();

      this.ctx.stroke();
      
      lastAngle = currentAngle;
    }
    
    this.ctx.fillStyle = "black";
    lastAngle = 0;

    for(var j = 0; j < data_serie.getStructuredDataValues().length; j++){
      var dataPart = parseFloat(data_serie.getStructuredDataValues()[j])/totalValues;
      var currentAngle = lastAngle + 2*Math.PI*dataPart;

      if((currentAngle - lastAngle) > PieChart.MIN_ANGLE_TEXT){
        if(data_serie.getStructuredDataTags()[j].length <= PieChart.MAX_NUMBER_OF_DIGITS){
          this.ctx.fillText(data_serie.getStructuredDataTags()[j], 
          PieChart.BIG_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + (PieChart.X_CENTER - pie_chart.getLetterTagWidth()/2) + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
            PieChart.BIG_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
        }

        if(data_serie.getStructuredDataValues()[j].toString().length <= PieChart.MAX_NUMBER_OF_DIGITS){
          this.ctx.fillText(data_serie.getStructuredDataValues()[j].toString(), 
          PieChart.SMALL_RADIO*Math.cos((currentAngle - (currentAngle - lastAngle)/2)) + (PieChart.X_CENTER - pie_chart.getLetterValueWidth()/2) + PieChart.PADDING_LEFT - PieChart.PADDING_RIGHT, 
            PieChart.SMALL_RADIO*Math.sin((currentAngle - (currentAngle - lastAngle)/2)) + PieChart.Y_CENTER + PieChart.PADDING_TOP - PieChart.PADDING_BOTTOM);
        }
      }

      lastAngle = currentAngle;
    }
  }

  barChartIdFromDataSerie(data_serie_id){
    var bar_i = null;
    
    for(var i = 0; i < this.bar_charts.length; i++){
      if(this.bar_charts[i].getDataSerie().getId().toString() == data_serie_id)
        bar_i = i;
    }

    return bar_i;
  }

  lineChartIdFromDataSerie(data_serie_id){
    var line_i = null;

    for(var i = 0; i < this.line_charts.length; i++){
      if(this.line_charts[i].getDataSerie().getId() == data_serie_id)
        line_i = i;
    }

    return line_i;
  }

  pieChartIdFromDataSerie(data_serie_id){
    var pie_i = null;

    for(var i = 0; i < this.pie_charts.length; i++){
      if(this.pie_charts[i].getDataSerie().getId() == data_serie_id)
        pie_i = i;
    }

    return pie_i;
  }

  changeScaleBarChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setScale(value);
    this.drawBarChart(real_id);
  }
  
  changeLineWidthBarChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setLineWidth(value);
    this.drawBarChart(real_id);
  }

  changeShadowsBarChart(id){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setShadows();
    this.drawBarChart(real_id);
  }

  changeTransparencyBarChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setTransparency(value);
    this.drawBarChart(real_id);
  }

  changeGradientBarChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setGradient(value);
    this.drawBarChart(real_id);
  }

  changeGradientColorBarChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setGradientColor(value);
    this.drawBarChart(real_id);
  }

  changeThreedEffectBarChart(id){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.barChartIdFromDataSerie(data_serie_id);
    var bar_chart = this.bar_charts[real_id];
    bar_chart.setThreedEffect();
    this.drawBarChart(real_id);
  }

  changeScaleLineChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.lineChartIdFromDataSerie(data_serie_id);
    var line_chart = this.line_charts[real_id];
    line_chart.setScale(value);
    this.drawLineChart(real_id);
  }

  changeLineWidthLineChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.lineChartIdFromDataSerie(data_serie_id);
    var line_chart = this.line_charts[real_id];
    line_chart.setLineWidth(value);
    this.drawLineChart(real_id);
  }

  changeShadowsLineChart(id){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.lineChartIdFromDataSerie(data_serie_id);
    var line_chart = this.line_charts[real_id];
    line_chart.setShadows();
    this.drawLineChart(real_id);
  }

  changeTransparencyLineChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.lineChartIdFromDataSerie(data_serie_id);
    var line_chart = this.line_charts[real_id];
    line_chart.setTransparency(value);
    this.drawLineChart(real_id);
  }

  changeLineWidthPieChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setLineWidth(value);
    this.drawPieChart(real_id);
  }

  changeShadowsPieChart(id){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setShadows();
    this.drawPieChart(real_id);
  }

  changeTransparencyPieChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setTransparency(value);
    this.drawPieChart(real_id);
  }

  changeGradientPieChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setGradient(value);
    this.drawPieChart(real_id);
  }

  changeGradientColorPieChart(id, value){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setGradientColor(value);
    this.drawPieChart(real_id);
  }

  changeThreedEffectPieChart(id){
    var data_serie_id = id.substring(id.length - 1);
    var real_id = this.pieChartIdFromDataSerie(data_serie_id);
    var pie_chart = this.pie_charts[real_id];
    pie_chart.setThreedEffect();
    this.drawPieChart(real_id);
  }
}

var application = new APICanvasApplication();

class DataSerie{
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

  structureData(){
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

      aux_value = unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-1];
      aux_value = aux_value.replaceAll('.', '');
      aux_value = aux_value.replace(',','.');

      this.setStructuredDataValues(i, aux_value);
    }

    this.structured_data_tags = this.structured_data_tags.reverse();
    this.structured_data_values = this.structured_data_values.reverse();
    this.normalizeValues();
  }

  normalizeValues(){
    var int_normalization = false;
    var int_expression = /^-?\d+$/;

    for(var i = 0; i < this.structured_data_values.length && !int_normalization; i++){
      if(int_expression.test(this.structured_data_values[i]))
        int_normalization = true;
    }

    var element = 0;

    for(var i = 0; i < this.structured_data_values.length; i++){
      if(int_normalization)
        element = parseInt(this.structured_data_values[i], 10);
      else
        element = parseFloat(parseFloat(this.structured_data_values[i]).toFixed(2));

      this.setStructuredDataValues(i, element);
    }
  }

  getMaxSerieValue(){
    var max = 0;

    for(var i = 0; i < this.getStructuredDataValues().length; i++){
      if(parseFloat(this.getStructuredDataValues()[i]) > max)
        max = parseFloat(this.getStructuredDataValues()[i]);
    }

    return max;
  }
}

class Chart{
  static WIDTH = 805;
  static HEIGHT = 400;

  static MAX_FONT = 15;
  static MIN_FONT = 12;

  constructor(id, data_serie, letter_value_width, letter_tag_width, letter_height) {
    this.id = id;
    this.data_serie = data_serie;

    this.letter_value_width = letter_value_width;
    this.letter_tag_width = letter_tag_width;
    this.letter_height = letter_height;
    this.letter_font =  "Times New Roman";

    this.colors = [];
    this.sectionColor = 'white';
    this.previousSectionColor = 'white';

    this.strokeStyle = 'black';
    this.lineWidth = 2.0;
    this.shadows = false;
    this.transparency = 1.0;
    this.gradient = 0.0;
    this.gradientColor = '#ffffff';
    this.threedEffect = false;
  }

  getId(){
    return this.id;
  }

  getDataSerie(){
    return this.data_serie;
  }

  getLetterFont(){
    return this.letter_font;
  }

  getLetterValueWidth(){
    return this.letter_value_width;
  }

  getLetterTagWidth(){
    return this.letter_tag_width;
  }

  getLetterHeight(){
    return this.letter_height;
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

  getThreedEffect(){
    return this.threedEffect;
  }

  setLetterHeight(letter_height){
    this.letter_height = letter_height;
  }

  setLetterValueWidth(letter_value_width){
    this.letter_value_width = letter_value_width;
  }

  setLetterTagWidth(letter_tag_width){
    this.letter_tag_width = letter_tag_width;
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

  setThreedEffect(){
    this.threedEffect = !this.threedEffect;
  }

  getSectionColor(){
    do{
      this.sectionColor = 360 * Math.random();
    }while(this.previousSectionColor == this.sectionColor);
    this.previousSectionColor = this.sectionColor;

    return "hsl(" + this.sectionColor + ", 100%, 90%)";
  }

  insertChartData(){
    var check_select = document.getElementById("charts-" + this.data_serie.getId());
    var new_content;

    if(check_select !== null){
      var option = document.createElement("option");
      option.value = this.getChartType();

      if (this.getChartType() == "bar"){
        option.text = "Gráfico de barras";
      } else if(this.getChartType() == "line") {
        option.text = "Gráfico de líneas";
      } else if(this.getChartType() == "pie") {
        option.text = "Gráfico circular";
      }

      check_select.add(option);

      document.getElementById("canvas-" + this.data_serie.getId()).insertAdjacentHTML("beforeend", "<canvas id=\"" + this.getChartType()  + "-chart-" + this.data_serie.getId() + "\"></canvas>");
      document.getElementById(this.getChartType()  + "-chart-" + this.data_serie.getId()).style.display = "none";
      document.getElementById("remove-buttons-" + this.data_serie.getId()).insertAdjacentHTML("beforeend", "     <button class=\"remove-chart-button\" id=\"remove-" + this.getChartType() + "-chart-button-" + this.data_serie.getId() + "\" onclick=\"application.removeChart(this.id)\">Eliminar gráfica</button>");
      document.getElementById("remove-" + this.getChartType() + "-chart-button-" + this.data_serie.getId()).style.display = "none";
      document.getElementById("options-buttons-" + this.data_serie.getId()).insertAdjacentHTML("beforeend", "<button class=\"show-options-button\" id=\"" + this.getChartType() + "-options-buttons-" + this.data_serie.getId() + "\" onclick=\"application.showOptions(this.id)\">Mostrar opciones</button>");
      document.getElementById(this.getChartType() + "-options-buttons-" + this.data_serie.getId()).style.display = "none";
    } else{
        new_content = 
          "<div class=\"whole-chart-content\" id=\"whole-chart-content-" + this.data_serie.getId() + "\">\n" +
          " <div id=\"remove-buttons-" + this.data_serie.getId() + "\">\n" +
          "   <button class=\"remove-chart-button\" id=\"remove-" + this.getChartType() + "-chart-button-" + this.data_serie.getId() + "\" onclick=\"application.removeChart(this.id)\">Eliminar gráfica</button>\n" +
          " </div>\n" +
          " <h3>Título: " + this.data_serie.getTitle() + "</h3>\n" +
          " <hr class=\"solid\">\n";
        
        new_content += " <p><b>Criterios de selección usados:</b>"+ this.data_serie.getNumberOfVariables() +"</p>\n";
  
        for(var i = 0; i <this.data_serie.getNumberOfVariables(); i++){
          new_content += " <p><u>Criterio de selección " + (i+1) + " (" + this.data_serie.getVariableTags()[i] + "):</u> " + this.data_serie.getVariableValues()[i] + "</p>\n";
        }

        new_content += " <p><b>Gráficas cargadas: </b>\n";
        new_content += "  <select id=\"charts-" + this.data_serie.getId() + "\" onchange=\"application.changeChartVisualized(this.id, this.value)\">\n";

        if (this.getChartType() == "bar"){
          new_content += "   <option value=\"" + this.getChartType() + "\">Gráfico de barras</option>\n";
        } else if(this.getChartType() == "line") {
          new_content += "   <option value=\"" + this.getChartType() + "\">Gráfico de líneas</option>\n";
        } else if(this.getChartType() == "pie") {
          new_content += "   <option value=\"" + this.getChartType() + "\">Gráfico circular</option>\n";
        }
  
        new_content += "  </select>\n";
        new_content += " </p>\n";

        new_content += " <div id=\"options-buttons-" + this.data_serie.getId() + "\"\n>";
        new_content += "  <button class=\"show-options-button\" id=\"" + this.getChartType() + "-options-buttons-" + this.data_serie.getId() + "\" onclick=\"application.showOptions(this.id)\">Mostrar opciones</button>\n";
        new_content += " </div>\n";

        new_content += " <div id=\"canvas-" + this.data_serie.getId() + "\"\n>"
        new_content += "  <canvas id=\"" + this.getChartType()  + "-chart-" + this.data_serie.getId() + "\"></canvas>\n";
        new_content += " </div>\n"

        new_content += " <div id=\"options-" + this.data_serie.getId() + "\"></div>\n";
  
        document.getElementById("charts-content").insertAdjacentHTML("beforeend", new_content);
      }

      new_content = "";

      if(this.getChartType() == "bar"){

        new_content += " <div class=\"options-panel-chart\" id=\"bar-chart-options-" + this.data_serie.getId() + "\"\n>";
        new_content += "  <h3><u>OPCIONES</u></h3>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Escala</h5>\n";
        new_content += "   <select id=\"bar-scale-" + this.data_serie.getId() + "\" onchange=\"application.changeScaleBarChart(this.id, this.value)\">\n";
        new_content += "    <option value=\"linear\" selected>Lineal</option>\n";
        new_content += "    <option value=\"logarithmic\">Logarítmica</option>\n";
        new_content += "   </select>\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Grosor de línea</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"bar-linewidth-" + this.data_serie.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
        + "onchange=\"application.changeLineWidthBarChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Opacidad</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"bar-transparency-" + this.data_serie.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
        + "value=\"1.0\" onchange=\"application.changeTransparencyBarChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Sombras</h5>\n";
        new_content += "   <input type=\"checkbox\" id=\"bar-shadows-" + this.data_serie.getId() + "\""
        + "onchange=\"application.changeShadowsBarChart(this.id)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Gradiente</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"bar-gradient-" + this.data_serie.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
        + "value=\"0.0\" onchange=\"application.changeGradientBarChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Color del gradiente</h5>\n";
        new_content += "   <input type=\"color\" id=\"bar-color-gradient-" + this.data_serie.getId() + "\" "
        + "value=\"#ffffff\" onchange=\"application.changeGradientColorBarChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";
        
        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Efecto 3D</h5>\n";
        new_content += "   <input type=\"checkbox\" id=\"bar-threed-" + this.data_serie.getId() + "\""
        + "onchange=\"application.changeThreedEffectBarChart(this.id)\">\n";
        new_content += "  </div>\n";
        new_content += " </div>\n";

      } else if(this.getChartType() == "line"){ 

        new_content += " <div class=\"options-panel-chart\" id=\"line-chart-options-" + this.data_serie.getId() + "\">\n";
        new_content += "  <h3><u>OPCIONES</u></h3>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Escala</h5>\n";
        new_content += "   <select id=\"line-scale-" + this.data_serie.getId() + "\" onchange=\"application.changeScaleLineChart(this.id, this.value)\">\n";
        new_content += "    <option value=\"linear\" selected>Lineal</option>\n";
        new_content += "    <option value=\"logarithmic\">Logarítmica</option>\n";
        new_content += "   </select>\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Grosor de línea</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"line-linewidth-" + this.data_serie.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
        + "onchange=\"application.changeLineWidthLineChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Opacidad</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"line-transparency-" + this.data_serie.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
        + "value=\"1.0\" onchange=\"application.changeTransparencyLineChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Sombras</h5>\n";
        new_content += "    <input type=\"checkbox\" id=\"line-shadows-" + this.data_serie.getId() + "\""
        + "onchange=\"application.changeShadowsLineChart(this.id)\">\n";
        new_content += "  </div>\n";
        new_content += " </div>\n";

      } else if(this.getChartType() == "pie"){

        new_content += " <div class=\"options-panel-chart\" id=\"pie-chart-options-" + this.data_serie.getId() + "\">\n";
        new_content += "  <h3><u>OPCIONES</u></h3>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Grosor de línea</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"pie-linewidth-" + this.data_serie.getId() + "\" min=\"1.0\" max=\"3.0\" step=\"0.1\""
        + "onchange=\"application.changeLineWidthPieChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Opacidad</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"pie-transparency-" + this.data_serie.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
        + "value=\"1.0\" onchange=\"application.changeTransparencyPieChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

         new_content += "  <div class=\"options-panel-chart-section\">\n";
         new_content += "   <h5>Sombras</h5>\n";
         new_content += "   <input type=\"checkbox\" id=\"pie-shadows-" + this.data_serie.getId() + "\""
         + "onchange=\"application.changeShadowsPieChart(this.id)\">\n";
         new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Gradiente</h5>\n";
        new_content += "   <input type=\"range\" class=\"range-style\" id=\"pie-gradient-" + this.data_serie.getId() + "\" min=\"0.0\" max=\"1.0\" step=\"0.1\""
        + "value=\"0.0\" onchange=\"application.changeGradientPieChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Color del gradiente</h5>\n";
        new_content += "   <input type=\"color\" id=\"pie-color-gradient-" + this.data_serie.getId() + "\" "
        + "value=\"#ffffff\" onchange=\"application.changeGradientColorPieChart(this.id, this.value)\">\n";
        new_content += "  </div>\n";

        new_content += "  <div class=\"options-panel-chart-section\">\n";
        new_content += "   <h5>Efecto 3D</h5>\n";
        new_content += "   <input type=\"checkbox\" id=\"pie-threed-" + this.data_serie.getId() + "\""
        + "onchange=\"application.changeThreedEffectPieChart(this.id)\">\n";
        new_content += "  </div>\n";
        new_content += " </div>\n";
      }

      document.getElementById("options-" + this.data_serie.getId()).insertAdjacentHTML("beforeend", new_content);
      document.getElementById(this.getChartType()  + "-chart-" + this.data_serie.getId()).width = Chart.WIDTH.toString();
      document.getElementById(this.getChartType()  + "-chart-" + this.data_serie.getId()).height = Chart.HEIGHT.toString();

      return (check_select === null);
    }
}

class BarChart extends Chart{
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 30;
  static PADDING_BOTTOM = 30;
  static LOG_MARGIN = Math.log(1);

  static MAX_NUMBER_OF_DIGITS = 5;

  static STANDARDIZE_SCALE_FACTOR = 1.25;
  static MAX_LOG_VALUE = 3.0;
  static MIN_LOG_VALUE = 0.0;

  static BARS_MARGIN = 7.5;
  static MAX_NUMBER_OF_VERTICAL_LINES = 10;
  static MIN_NUMBER_OF_VERTICAL_LINES = 2;
  static VERTICAL_LINES_WIDTH = 5;

  static LETTER_VALUE_WIDTH = 30;
  static LETTER_TAG_WIDTH = 30;
  static LETTER_HEIGHT = 15;
  static LETTERS_MARGIN_LEFT = 10;
  static LETTERS_MARGIN_TOP = 15;
  static LETTERS_MARGIN_BOTTOM = 5;

  static THREE_D_X_DISPLACEMENT = 15;
  static THREE_D_Y_DISPLACEMENT = 10;

  constructor(id, data_serie) {
    super(id, data_serie, BarChart.LETTER_VALUE_WIDTH, BarChart.LETTER_TAG_WIDTH, BarChart.LETTER_HEIGHT);
    
    this.bar_width = Math.max(BarChart.LETTER_VALUE_WIDTH, BarChart.LETTER_TAG_WIDTH);

    this.scale = "linear";
    this.space_between_bars = 20;
    this.text_appearance = 1;
    this.visible_values = true;

    var logMaxValue = Math.log10(data_serie.getMaxSerieValue());

    if(logMaxValue >= BarChart.MAX_LOG_VALUE)
      this.number_of_vertical_lines = BarChart.MAX_NUMBER_OF_VERTICAL_LINES;
    else if(logMaxValue <= BarChart.MIN_LOG_VALUE)
      this.number_of_vertical_lines = BarChart.MIN_NUMBER_OF_VERTICAL_LINES;
    else
      this.number_of_vertical_lines = Math.trunc((BarChart.MAX_NUMBER_OF_VERTICAL_LINES-BarChart.MIN_NUMBER_OF_VERTICAL_LINES)/logMaxValue);

    this.max_value_linear_graph = Math.ceil((data_serie.getMaxSerieValue()*BarChart.STANDARDIZE_SCALE_FACTOR)/(this.number_of_vertical_lines - 1))*(this.number_of_vertical_lines - 1);
    this.max_value_logarithmic_graph = Math.ceil(this.data_serie.getMaxSerieValue()/(this.number_of_vertical_lines - 1))*(this.number_of_vertical_lines - 1);

    if(this.max_value_linear_graph == 0)
      this.max_value_linear_graph = 1;

    if(this.max_value_logarithmic_graph == 0)
      this.max_value_logarithmic_graph = 1;
    
    this.linear_scale_factor = (Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM)/this.max_value_linear_graph;
    this.logarithmic_scale_factor = (Math.log(Chart.HEIGHT - BarChart.PADDING_TOP - BarChart.PADDING_BOTTOM) - BarChart.LOG_MARGIN)/this.max_value_logarithmic_graph;
  }

  setScale(value){
    this.scale = value;
  }

  setSpaceBetweenBars(space_between_bars){
    this.space_between_bars = space_between_bars;
  }

  setBarWidth(bar_width){
    this.bar_width = bar_width;
  }

  setTextAppearance(text_appearance){
    this.text_appearance = text_appearance;
  }

  setVisibleValues(){
    this.visible_values = !this.visible_values;
  }

  getScale(){
    return this.scale;
  }

  getChartType(){
    return 'bar';
  }

  getSpaceBetweenBars(){
    return this.space_between_bars;
  }

  getTextAppearance(){
    return this.text_appearance;
  }

  getVisibleValues(){
    return this.visible_values;
  }

  getBarWidth(){
    return this.bar_width;
  }

  getLinearScaleFactor(){
    return this.linear_scale_factor;
  }

  getLogarithmicScaleFactor(){
    return this.logarithmic_scale_factor;
  }

  getNumberOfVerticalLines(){
    return this.number_of_vertical_lines;
  }

  getMaxValueLinearChart(){
    return this.max_value_linear_graph;
  }

  getMaxValueLogarithmicChart(){
    return this.max_value_logarithmic_graph;
  }

  checkWidthLimit(variable_quantities){
    var result = false;

    if(BarChart.PADDING_LEFT + BarChart.BARS_MARGIN + variable_quantities*this.data_serie.getStructuredDataTags().length
     + BarChart.PADDING_RIGHT >= Chart.WIDTH)
      result = true;

    return result;
  }
}

class LineChart extends Chart{
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 30;
  static PADDING_BOTTOM = 30;
  static LOG_MARGIN = Math.log(1);

  static MAX_NUMBER_OF_DIGITS = 5;

  static STANDARDIZE_SCALE_FACTOR = 1.25;
  static MAX_LOG_VALUE = 3.0;
  static MIN_LOG_VALUE = 0.0;

  static LINES_MARGIN = 30;
  static MIN_SPACE_BETWEEN_POINTS = 15;
  static MAX_NUMBER_OF_VERTICAL_LINES = 10;
  static MIN_NUMBER_OF_VERTICAL_LINES = 2;
  static VERTICAL_LINES_WIDTH = 5;

  static LETTER_VALUE_WIDTH = 30;
  static LETTER_TAG_WIDTH = 30;
  static LETTER_HEIGHT = 15;
  static LETTERS_MARGIN_LEFT = 10;
  static LETTERS_MARGIN_TOP = 15;
  static LETTERS_MARGIN_BOTTOM = 5;

  constructor(id, data_serie) {
    super(id, data_serie, LineChart.LETTER_VALUE_WIDTH, LineChart.LETTER_TAG_WIDTH, LineChart.LETTER_HEIGHT);

    this.scale = "linear";
    this.space_between_points = 50;
    this.text_appearance = 1;

    var logMaxValue = Math.log10(data_serie.getMaxSerieValue());

    if(logMaxValue >= LineChart.MAX_LOG_VALUE)
      this.number_of_vertical_lines = LineChart.MAX_NUMBER_OF_VERTICAL_LINES;
    else if(logMaxValue <= LineChart.MIN_LOG_VALUE)
      this.number_of_vertical_lines = LineChart.MIN_NUMBER_OF_VERTICAL_LINES;
    else
      this.number_of_vertical_lines = Math.trunc((LineChart.MAX_NUMBER_OF_VERTICAL_LINES-LineChart.MIN_NUMBER_OF_VERTICAL_LINES)/logMaxValue);
  
      this.max_value_linear_graph = Math.ceil((data_serie.getMaxSerieValue()*LineChart.STANDARDIZE_SCALE_FACTOR)/(this.number_of_vertical_lines - 1))*(this.number_of_vertical_lines - 1);
      this.max_value_logarithmic_graph = Math.ceil(this.data_serie.getMaxSerieValue()/(this.number_of_vertical_lines - 1))*(this.number_of_vertical_lines - 1);
  
      if(this.max_value_linear_graph == 0)
        this.max_value_linear_graph = 1;
  
      if(this.max_value_logarithmic_graph == 0)
        this.max_value_logarithmic_graph = 1;
      
      this.linear_scale_factor = (Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM)/this.max_value_linear_graph;
      this.logarithmic_scale_factor = (Math.log(Chart.HEIGHT - LineChart.PADDING_TOP - LineChart.PADDING_BOTTOM) - LineChart.LOG_MARGIN)/this.max_value_logarithmic_graph;
  }

  setScale(value){
    this.scale = value;
  }

  setSpaceBetweenPoints(space_between_points){
    this.space_between_points = space_between_points;
  }

  setTextAppearance(text_appearance){
    this.text_appearance = text_appearance;
  }

  getScale(){
    return this.scale;
  }

  getChartType(){
    return 'line';
  }

  getSpaceBetweenPoints(){
    return this.space_between_points;
  }

  getTextAppearance(){
    return this.text_appearance;
  }

  getLinearScaleFactor(){
    return this.linear_scale_factor;
  }

  getLogarithmicScaleFactor(){
    return this.logarithmic_scale_factor;
  }

  getNumberOfVerticalLines(){
    return this.number_of_vertical_lines;
  }

  getMaxValueLinearChart(){
    return this.max_value_linear_graph;
  }

  getMaxValueLogarithmicChart(){
    return this.max_value_logarithmic_graph;
  }

  checkWidthLimit(variable_quantities){
    var result = false;

    if(LineChart.PADDING_LEFT + LineChart.LINES_MARGIN + variable_quantities*this.data_serie.getStructuredDataTags().length
     + LineChart.PADDING_RIGHT >= Chart.WIDTH)
      result = true;

    return result;
  }
}


class PieChart extends Chart{
  static PADDING_LEFT = 50;
  static PADDING_RIGHT = 10;
  static PADDING_TOP = 30;
  static PADDING_BOTTOM = 30;

  static MAX_NUMBER_OF_DIGITS = 5;

  static X_CENTER = 300;
  static Y_CENTER = 225;
  static BIG_RADIO = 175;
  static RADIO = 125;
  static SMALL_RADIO = 90;
  static SMALL_GRADIENT_RADIO = 50;

  static MIN_ANGLE_TEXT = Math.PI/6;
  static LETTER_VALUE_WIDTH = 30;
  static LETTER_TAG_WIDTH = 30;
  static LETTER_HEIGHT = 12.5;

  static THREED_DEPTH = 60;
  static THREED_REFERENCE_X_POINT = 350;
  static THREED_REFERENCE_RADIO = 136;
  static THREED_SHADOW_CORRECTOR = PieChart.THREED_REFERENCE_RADIO - PieChart.RADIO + 7;

  constructor(id, data_serie) {
    super(id, data_serie, PieChart.LETTER_VALUE_WIDTH, PieChart.LETTER_TAG_WIDTH, PieChart.LETTER_HEIGHT);
  
    this.gradientActivated = false;
  }

  setGradient(gradient){
    this.gradient = gradient;

    if(gradient != 0)
      this.gradientActivated = true;
    else
      this.gradientActivated = false;
  }

  getChartType(){
    return 'pie';
  }

  getGradientActivated(){
    return this.gradientActivated;
  }
}