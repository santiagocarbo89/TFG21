//Clase Rectangle

class Rectangle {
    constructor(x, y, w, h, color) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
    }

    draw(c) {
        c.save()
        c.beginPath()
        c.fillStyle = this.color;
        c.fillRect (this.x, this.y, this.w, this.h)
        c.fill()
        c.closePath()
        c.restore()
    }

    update(c) {
        this.draw(c)
    }
}


//Clase TwoDimensionsGraph
class TwoDimensionsGraph {
    constructor() {
        this.AxleX = new Rectangle(0, 0, 10, 500, '#000000');
        this.AxleY = new Rectangle(0, 500, 500, 10, '#000000');
        this.Serie1 = new Rectangle(20, 300, 50, 200, '#00FF00');
        this.Serie2 = new Rectangle(80, 330, 50, 170, '#FF0000');
    }

    draw(c) {
        c.save()
        c.beginPath()
        this.AxleX.draw(c)
        this.AxleY.draw(c)
        this.Serie1.draw(c)
        this.Serie2.draw(c)
        c.fill()
        c.closePath()
        c.restore()
     }
     
     update(c) {
        this.draw(c)
     }
}

// Clase Canvas	

class CanvasDisplay {
    constructor() {
        this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
        this.stageConfig = {
		    width: window.innerWidth,
		    height: window.innerHeight
        };         
        
        this.canvas.width = this.stageConfig.width;
        this.canvas.height = this.stageConfig.height;
        this.TwoDimensionsGraph = new TwoDimensionsGraph()
    }
      
    animate() {
        this.ctx.clearRect(0, 0, this.stageConfig.width, this.stageConfig.height);
        this.TwoDimensionsGraph.update(this.ctx)
    }
}

let canvasDisplay = new CanvasDisplay();
canvasDisplay.animate();