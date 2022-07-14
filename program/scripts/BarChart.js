class BarChart{
    static scale = 1;

    constructor(configuration) {
        this.canvas = configuration.canvas;
        this.ctx = configuration.ctx;
        this.data = configuration.data;
        this.colors = configuration.colors;
        this.lineWidth = configuration.lineWidth;
    }

    drawLine(x1, y1, x2, y2, color, lineWidth) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBar(x1, y1, width, height, color, lineWidth) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillRect(x1, y1, width, height);
        this.ctx.restore();
    }

    drawVerticalBarChart() {
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

    drawHorizontalBarChart() {

    }
}

export { BarChart }
