class Point {
  constructor(x, y, context) {
    this.x = x;
    this.y = y;
    this.context = context;
  }
  bySlope(p, q) { 
    return this.slopeTo(p) - this.slopeTo(q); 
  }
  compareTo(that) {
    if (this.y < that.y) return -1;
    else if (this.y > that.y) return 1;
    else if (this.x < that.x) return -1;
    else if (this.x > that.x) return 1;
    else return 0;
  }
  slopeTo(that) {
    if (this.x == that.x && this.y == that.y) return -Infinity;
    else if (this.y == that.y) return 0.0;
    else if (this.x == that.x) return Infinity;
    else return (that.y - this.y) / (that.x - this.x);
  }
  draw() { 
    this.context.fillRect(this.x, this.y, 5, 5); 
  }
  moveRandom() {
    if (this.x == 0) { 
      this.x = 1;
    } else if (this.x == this.context.width) {
      this.x -= 1;
    } else {
      var dX = Math.round(Math.random());
      this.x = Math.round(Math.random()) == 0 ? this.x + dX : this.x - dX;
    }
    if (this.y == 0) {
      this.y = 1;
    } else if (this.y == this.context.height) {
      y -= 1;
    } else {
      var dY = Math.round(Math.random());
      this.y = Math.round(Math.random()) == 0 ? this.y + dY : this.y - dY;
    }
  }
}

class Animation {
  constructor(container) {
    this.points = [];
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    container.innerHTML = '<canvas id="context" width="' + this.width + '" height="' + this.height + '"></canvas>';
    this.canvas = document.getElementById('context');
    this.context = this.canvas.getContext('2d'); 
    this.context.fillStyle = 'rgb(200, 255, 255)';
    this.context.strokeStyle = '#ff0000';
    this.context.lineWidth = 1;
    this.canvas.addEventListener('click', function(elt){
      this.pointFromClick(elt);
    }.bind(this));
  }

  point(x, y) {
    return new Point(x, y, this.context);
  }

  pointFromClick(elt) {
    this.points.push(this.point(elt.clientX, elt.clientY));
  }

  animate() {
    this.points.forEach(function(point){
      point.moveRandom();
    });
    this.context.clearRect(0, 0, this.width, this.height);
    this.drawPoints();
    window.requestAnimationFrame(function() {
      this.animate();
    }.bind(this));
  }

  drawPoints() {
    this.points.forEach(function(point) {
      point.draw();
    });
  }
}

// gaussian random generator from https://stackoverflow.com/a/39187274
function gaussianRand() {
  var rand = 0;
  for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
  return rand / 6;
}
function gaussianRandom(limit) { return Math.floor(gaussianRand() * (limit + 1)); }
function uniformRandom(limit) { return Math.floor(Math.random() * limit); }
function gaussianRandomPoint(xLimit, yLimit) { return new Point(gaussianRandom(xLimit), gaussianRandom(yLimit)); }
function uniformRandomPoint(xLimit, yLimit) { return new Point(uniformRandom(xLimit), uniformRandom(yLimit)); }
function generatePoints(x, array, context, pointBuilder) {
  for (var _ = 0; _ < x; _++)
    array.push(pointBuilder(context.width, context.height));
}



function main() {
  var anim = new Animation(document.getElementById('container'));
  anim.animate();
}

window.addEventListener("load", function() {
  main();
});
