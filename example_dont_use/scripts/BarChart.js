class BarChart{
    static scale = 1;

    constructor(configuration) {
        this.canvas = configuration.canvas;
        this.ctx = configuration.ctx;
        this.data = configuration.data;
        this.colors = configuration.colors;
        this.lineWidth = configuration.lineWidth;
    }

   

    drawHorizontalBarChart() {

    }
}

export { BarChart }
