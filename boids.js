const MAX_SPEED = 15;
const MIN_SPEED = 3;
const ACCEL = 1.03;

class Point {
  constructor(x, y, context, center, width, height) {
    this.x = x;
    this.y = y;
    this.xMax = width;
    this.yMax = height;
    this.speed = MIN_SPEED;
    if (center) {
      this.angle = this.angleInRadiansFrom(center);
    }
    if (context) {
      this.context = context;
    }
  }

  angleInRadiansFrom(that) {
    return Math.atan2(this.y - that.y, this.x - that.x);
  }

  move() {
    if (this.y < 0) {
      this.angle = -this.angle;
      this.y = 0;
      this.speed = MIN_SPEED;
    }
    else if (this.y > this.yMax) {
      this.angle = -this.angle;
      this.y = this.yMax;
      this.speed = MIN_SPEED;
    }
    else if (this.x < 0) {
      this.angle = Math.PI - this.angle;
      this.x = 0;
      this.speed = MIN_SPEED;
    }
    else if (this.x > this.xMax) {
      this.angle = Math.PI - this.angle;
      this.x = this.xMax;
      this.speed = MIN_SPEED;
    }
    else {
      if (this.speed < MAX_SPEED) { this.speed *= ACCEL; }
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
    }
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
    this.width = document.documentElement.clientWidth - 5;
    this.height = document.documentElement.clientHeight - 5;
    this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
    container.innerHTML = '<canvas id="context" width="' + this.width + '" height="' + this.height + '"></canvas>';
    this.canvas = document.getElementById('context');
    this.context = this.canvas.getContext('2d'); 
    this.context.fillStyle = 'rgb(200, 255, 255)';
    this.context.strokeStyle = '#ff0000';
    this.context.lineWidth = 1;
    this.canvas.addEventListener('click', function(elt){
      this.pointFromClick(elt);
      // this.generatePoints(20, this.gaussianRandomPoint);
    }.bind(this));
    this.doAnim = true;
    document.getElementById('stop').addEventListener('click', function() {
      this.doAnim = !this.doAnim;
      if (this.doAnim) { this.animate(); }
    }.bind(this));
  }

  size() { return this.points.length; }
  newPoint(x, y) {
    return new Point(x, y, this.context, this.center, this.width, this.height);
  }

  pointFromClick(elt) {
    this.points.push(this.newPoint(elt.clientX, elt.clientY));
  }

  generatePoints(x, pointBuilder) {
    for (var _ = 0; _ < x; _++)
      this.points.push(this.gaussianRandomPoint());
  }

  static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }
  static uniformRandom(limit) { return Math.floor(Math.random() * limit); }
  gaussianRandomPoint() { 
    return this.newPoint(Animation.gaussianRandom(this.width), Animation.gaussianRandom(this.height)); 
  }
  uniformRandomPoint() { 
    return this.newPoint(Animation.uniformRandom(this.width), 
      Animation.uniformRandom(this.height)); 
  }
  // gaussian random generator from https://stackoverflow.com/a/39187274
  static gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
    return rand / 6;
  }

  animate() {
    this.points.forEach(function(point){
      point.move();
    });
    this.context.clearRect(0, 0, this.width, this.height);
    this.drawPoints();
    if (this.doAnim) {
      window.requestAnimationFrame(function() {
        this.animate();
      }.bind(this));
    }
  }

  drawPoints() {
    this.points.forEach(function(point) {
      point.draw();
    });
  }
}

function main() {
  var container = document.getElementById('container');
  var anim = new Animation(container);
  anim.animate();
}

window.addEventListener("load", function() {
  main();
});
