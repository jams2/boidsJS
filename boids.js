const MAX_SPEED = 2;
const MIN_SPEED = 3;
const ACCEL = 1.1;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.5;
const START_COUNT = 400;

// while inserting into tree, if node exists already at position, displace new node - collision detection

var stopButton = document.getElementById('stop');
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        stopButton.click();
    }
}

function equalPoints(b1, b2) {
    return Math.floor(b1.x * 1000) === Math.floor(b2.x * 1000) &&
        Math.floor(b1.y * 1000) === Math.floor(b2.y * 1000);
}

function compareDouble(a, b) {
    a = Math.floor(a * 1000);
    b = Math.floor(b * 1000);
    if (a === b) return 0;
    else if (a < b) return -1;
    else return 1;
}

function distanceSquared(point1, point2) {
    let dx = Math.abs(point1.x - point2.x);
    let dy = Math.abs(point1.y - point2.y);
    return Math.pow(dx, 2) + Math.pow(dy, 2);
}

class Node {
    constructor(point, _parent) {
        this.point = point;
        this._parent = _parent;
        this.lb = null;
        this.rt = null;
    }
}

class KdTree {
    constructor() {
        this.size = 0;
        this.root = null;
    }
    insert(point) {
        this.root = this.put(this.root, point, null, true);
    }
    put(node, point, _parent, isVertical) {
        if (node === null) {
            this.size++;
            return new Node(point, _parent);
        }
        if (equalPoints(point, node.point)) {
            // avoid collision here?
            return node;
        }
        let cmp = (isVertical) ? compareDouble(point.x, node.point.x) : compareDouble(point.y, node.point.y);
        switch (cmp) {
            case -1:
                node.lb = this.put(node.lb, point, node, !isVertical);
                break;
            default:
                node.rt = this.put(node.rt, point, node, !isVertical);
                break;
        }
        return node;
    }
    getNearest(nearest, queryPoint, node, isVertical) {
        // node - next node to compare queryPoint against
        if (node === null ||
                node.point === queryPoint && node.lb === null && node.rt === null) 
            return nearest;
        if (compareDouble(distanceSquared(node.point, queryPoint), distanceSquared(nearest, queryPoint)) < 0)
            nearest = node.point;
        let cmp = (isVertical) ? compareDouble(node.point.x, queryPoint.x) : compareDouble(node.point.y, queryPoint.y);
        // go down the branch closer to the query
        let next;
        switch(cmp) {
            case 1:
                next = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
                nearest = (next === queryPoint) ? nearest : next;
                // if nearest returned is greater than dist to current node, check the other branch
                if (compareDouble(distanceSquared(nearest, queryPoint),
                        this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                    next = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
                    nearest = (next === queryPoint) ? nearest : next;
                }
                break;
            default:
                next = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
                nearest = (next === queryPoint) ? nearest : next;
                if (compareDouble(distanceSquared(nearest, queryPoint),
                        this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                    next = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
                    nearest = (next === queryPoint) ? nearest : next;
                }
                break;
        }
        return nearest;
    }
    otherBranchDistSquared(nearest, node, vertical) {
        let distance;
        if (vertical) distance = Math.abs(node.point.x - nearest.x);
        else distance = Math.abs(node.point.y - nearest.y);
        return distance * distance;
    }
}

class Point {
    constructor(x, y, context, center, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.nearest = null;
        this.speed = MIN_SPEED;
        this.rotation = this.angleInRadiansFrom(center);
        this.context = context;
    }
    angleInRadiansFrom(that) {
        return Math.atan2(this.y - that.y, this.x - that.x);
    }
    updateSpeed(x) { this.speed = x; }
    updateRotation(x) { this.rotation = x; }
    getRotation() { return this.rotation; }
    getSpeed() { return this.speed; }

    move(centerOfMass) {
        if (this.y <= 0) this.y = this.width - 1;
        else if (this.y >= this.width) this.y = 1;
        else if (this.x <= 0) this.x = this.height - 1;
        else if (this.x >= this.height) this.x = 1;
        if (this.speed < MAX_SPEED) { this.speed *= ACCEL; }
        else if (this.speed < MIN_SPEED) { this.speed = MIN_SPEED; }
        if (this.nearest) {
            let rot = (compareDouble(this.rotation, this.nearest.rotation) >= 0) ? this.rotation : this.nearest.rotation;
            this.rotation = (2 * Math.PI) % (rot + Math.PI);
        }
        this.rotation = (2 * Math.PI) % (this.rotation + centerOfMass.angleInRadiansFrom(this));
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);
    }

    static updateRotationToCenterOfMass(point, centerOfMass) {
        let rotationToCenter = centerOfMass.angleInRadiansFrom(point);
        let rotationDiffA = point.rotation - rotationToCenter;
        let rotationDiffB = 2 * Math.PI - point.rotation + rotationToCenter;
        let rotationDiff = (rotationDiffA > rotationDiffB) ? rotationDiffB : rotationDiffA;
        return 2 * rotationDiff * ROTATION_RATE;
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

function drawCenterOfMass(context, point) { 
    context.fillStyle = 'rgb(255, 0, 0)';
    context.fillRect(point.x, point.y, 15, 15); 
    context.fillStyle = 'rgb(200, 255, 255)';
}

class Animation {
    constructor(container) {
        this.points = [];
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        container.innerHTML = '<canvas id="context" width="' + this.width + '" height="' + this.height + '"></canvas>';
        this.canvas = document.getElementById('context');
        this.context = this.canvas.getContext('2d'); 
        this.context.fillStyle = 'rgb(200, 255, 255)';
        this.context.strokeStyle = '#ff0000';
        this.context.lineWidth = 1;
        this.generatePoints(START_COUNT);
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
        //    if (this.size() > 0 && !this.isOutOfBounds(this.centerOfMass)) {
        //      this.centerOfMass = this.getAveragePosition();
        //    }
        //    else if (this.isOutOfBounds(this.centerOfMass)) {
        //      this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        //    }
        this.centerOfMass = this.getAveragePosition();
        let tree = new KdTree();
        this.points.forEach(function(point){
            //      if (this.size() > 0) {
            //        Animation.updateRotationToCenterOfMass(point, this.centerOfMass);
            //      }
            point.move(this.centerOfMass);
            tree.insert(point);
        }.bind(this));
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawPoints();
        this.points.forEach(point=>{
            point.nearest = tree.getNearest(tree.root.point, point, tree.root, true);
            //this.drawLine(point.nearest, point);
        });
        //drawCenterOfMass(this.context, this.getAveragePosition());
        tree = null;
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
    drawLine(b1, b2) {
        this.context.beginPath();
        this.context.moveTo(b1.x, b1.y);
        this.context.lineTo(b2.x, b2.y);
        this.context.stroke();
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
