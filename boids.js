const MAX_SPEED = 5;
const MIN_SPEED = 1;
const ACCEL = 1.02;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.025;

var stopButton = document.getElementById('stop');
document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      stopButton.click();
  }
}

class Point {
  constructor(x, y, context, center, width, height) {
    this.x = x;
    this.y = y;
    this.xMax = width;
    this.yMax = height;
    this.speed = MIN_SPEED;
    if (center) {
      this.rotation = this.angleInRadiansFrom(center);
    }
    if (context) {
      this.context = context;
    }
  }

  angleInRadiansFrom(that) {
    return Math.atan2(this.y - that.y, this.x - that.x);
  }

  updateSpeed(x) { this.speed = x; }
  updateRotation(x) { this.rotation = x; }
  getRotation() { return this.rotation; }
  getSpeed() { return this.speed; }

  move() {
    if (this.y < 0) {
      this.rotation = -this.rotation;
      this.y = 0;
      this.speed = MIN_SPEED;
    }
    else if (this.y > this.yMax) {
      this.rotation = -this.rotation;
      this.y = this.yMax;
      this.speed = MIN_SPEED;
    }
    else if (this.x < 0) {
      this.rotation = Math.PI - this.rotation;
      this.x = 0;
      this.speed = MIN_SPEED;
    }
    else if (this.x > this.xMax) {
      this.rotation = Math.PI - this.rotation;
      this.x = this.xMax;
      this.speed = MIN_SPEED;
    }
    else {
      if (this.speed < MAX_SPEED) { this.speed *= ACCEL; }
      else if (this.speed < MIN_SPEED) { this.speed = MIN_SPEED; }
      this.x += this.speed * Math.cos(this.rotation);
      this.y += this.speed * Math.sin(this.rotation);
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
    this.centerOfMass = this.newPoint(this.center.x, this.center.y);
    container.innerHTML = '<canvas id="context" width="' + this.width + '" height="' + this.height + '"></canvas>';
    this.canvas = document.getElementById('context');
    this.context = this.canvas.getContext('2d'); 
    this.context.fillStyle = 'rgb(200, 255, 255)';
    this.context.strokeStyle = '#ff0000';
    this.context.lineWidth = 1;
    this.generatePoints(3000);
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

  generatePoints(x) {
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

  getAveragePosition() {
    var sumX = 0;
    var sumY = 0;
    var len = this.size();
    for (var i = 0; i < len; i++) {
      sumX += this.points[i].x;
      sumY += this.points[i].y;
    }
    return this.newPoint(Math.floor(sumX/len), Math.floor(sumY/len));
  }

  isOutOfBounds(point) {
    return (point.x >= this.width || point.x <= 0 || point.y >= this.height || point.y <= 0);
  }

  animate() {
    // if (this.size() > 0 && !this.isOutOfBounds(this.centerOfMass)) {
    //   this.centerOfMass = this.getAveragePosition();
    // }
    // else if (this.isOutOfBounds(this.centerOfMass)) {
    //   this.centerOfMass = this.newPoint(this.center.x, this.center.y);
    // }
    this.points.forEach(function(point){
      if (this.size() > 0) {
        Animation.updateRotationToCenterOfMass(point, this.centerOfMass);
      }
      point.move();
    }.bind(this));
    this.context.clearRect(0, 0, this.width, this.height);
    this.drawPoints();
    if (this.doAnim) {
      window.requestAnimationFrame(function() {
        this.animate();
      }.bind(this));
    }
  }

  static updateRotationToCenterOfMass(point, centerOfMass) {
    var rotationToCenter = centerOfMass.angleInRadiansFrom(point);
    var rotationDiffA = point.getRotation() - rotationToCenter;
    var rotationDiffB = 2 * Math.PI - point.getRotation() + rotationToCenter;
    var rotationDiff = (rotationDiffA > rotationDiffB) ? rotationDiffB : rotationDiffA;
    point.updateRotation(2 * rotationDiff * ROTATION_RATE);
    point.updateSpeed(point.getSpeed() + rotationDiff * DECEL);
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
