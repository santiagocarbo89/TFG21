var data = [];


function showWebGL() {
    document.getElementById("WebGL-output").style.display = "block";
}

function showLoadButtom() {
    document.getElementById("show-charts-buttom").style.display = "inline-block";
}

function getCSVData() {
    var bar_canvas = document.getElementById('bar_chart');
    var csvForm = document.getElementById("obtainCSVForm");
    var csvFile = document.getElementById("csvFile");
        
    csvForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var inputFile = this.csvFile.files[0];    
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            aux_string_data = event.target.result;
                var second_quote = false;
                var aux;
                var aux_string_data;
                var aux_data = [];
        
            while(aux_string_data.search('"') > -1) { 
                if(second_quote){
                    aux = aux_string_data.substring(0, aux_string_data.search('"'));
                    aux_data = aux.split('\t');
                    aux_data = aux_data.filter(String);
                    data.push(aux_data);
                    aux_string_data = aux_string_data.substring(aux_string_data.search('"')+3);
                    aux_data = [];
                } else {
                    aux_string_data = aux_string_data.replace('"', '');
                }
        
                second_quote = !second_quote;
            }
        
            data.shift();
        }
        
        fileReader.readAsText(inputFile);
    });
}

function drawLine(x1, y1, x2, y2, color, lineWidth) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function drawBar(x1, y1, width, height, color, lineWidth) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillRect(x1, y1, width, height);
    ctx.restore();
}

function drawVerticalBarChart() {
    var cealing = 0;
    for(var i = 0; i < this.data.length; i++){
        cealing = Math.max(cealing, this.data[i]);
    }

    for(var i = 0; i <= cealing; i += BarChart.scale) {
        var y0 = this.canvas.height * (1-i/cealing);
        this.drawLine(0, y0, this.canvas.width, y0, this.colors[0], this.lineWidth);
    
        this.ctx.save();
        this.ctx.fillStyle = this.colors[0];
        this.ctx.font = "bold 10px Arial";
        this.ctx.fillText(i, 10, y0-2);
        this.ctx.restore();
    }

    var numberOfBars = Object.keys(this.data).length;
    var barSize = this.canvas.width/numberOfBars;

    for(var i = 0; i < this.data.length; i++){
        var barHeight = Math.round(this.canvas.height *  this.data[i]/cealing) ;
        drawBar(i * barSize, this.canvas.height - barHeight, barSize, barHeight,this.colors[i%this.colors.length]);
    }
}

