var ctx;
var colors = ["black","gray","maroon","purple","navy","green","blue","teal"];
var data = [];

function getCSVData() {
    const myForm = document.getElementById("obtainCSVForm");
    const csvFile = document.getElementById("csvFile");

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        console.log("Form submitted");

        const reader = new FileReader();
        reader.onload = function(event) {
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

        reader.readAsText(input);
    });
}

function draw_bar_chart() {
    const canvas = document.getElementById('bar_chart');
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            draw_bar_chart_body();
            draw_bar_chart_axes();
    }
}

function draw_bar_chart_body() {
    for(var i = 0; i < data.length; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        var dp = data[i];
        ctx.fillRect(35+i*100, 490 - dp*5 - 30, 50, dp*5);
    }
}

function draw_bar_chart_axes() {

    // Líneas para los ejes de coordenadas
    ctx.fillStyle = "black";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(30,10);
    ctx.lineTo(30,460);
    ctx.lineTo(490,460);
    ctx.stroke();

    //Sublíneas para el eje vertical
    ctx.fillStyle = "black";
    for(var i = 0; i < 6; i++) {
        ctx.fillText((5-i)*20 + "", 4, i*80+60);
        ctx.beginPath();
        ctx.moveTo(25, i*80+60);
        ctx.moveTo(30, i*80+60);
        ctx.stroke();
    }

    //Textos del eje horizontal
    var labels = ["JAN", "FEB", "MAR", "APR", "MAY"];
    for(var i = 0; i < 5; i++) {
        ctx.fillText(labels[i], 50+i*100, 475);
    }
}