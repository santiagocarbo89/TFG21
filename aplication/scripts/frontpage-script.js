var canvas;
var ctx;

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

