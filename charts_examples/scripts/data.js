var ctx;
var data = [16,68,20,30,54];

function getCSVData() {
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        console.log("Form submitted");

        const reader = new FileReader();
        reader.onload = function(evenet) {
            document.write(evenet.target.result);
        }

        reader.readAsText(input);
    });
}

function draw() {
    const canvas = document.getElementById('charts');
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            draw_charts();
            draw_labels();
    }
}

function draw_charts() {
    ctx.fillStyle = "blue";

    for(var i = 0; i < data.length; i++) {
        var dp = data[i];
        ctx.fillRect(35+i*100, 490 - dp*5 - 30, 50, dp*5);
    }
}

function draw_labels() {

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