const MAX_SPEED = 5;
const MIN_SPEED = 5;
const ACCEL = 1.001;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.4;
const START_COUNT = 5000;
const FULL_ROT = 2 * Math.PI;

function equalPoints(b10, b2) {
    return Math.floor(b10.x * 10000) === Math.floor(b2.x * 10000) &&
        Math.floor(b10.y * 10000) === Math.floor(b2.y * 10000);
}


function compareDouble(a, b) {
    a = Math.floor(a * 1000);
    b = Math.floor(b * 1000);
    if (a === b) return 0;
    else if (a < b) return -1;
    else return 1;
}


function distanceSquared(p, q) {
    if (p === q || equalPoints(p, q)) return Infinity;
    let dx = Math.abs(p.x - q.x);
    let dy = Math.abs(p.y - q.y);
    let result = Math.pow(dx, 2) + Math.pow(dy, 2);
    return Math.floor(result*1000)/1000;
}


class Node {
    constructor(point, _parent) {
        this.point = [point];
        this._parent = _parent;
        this.lb = null;
        this.rt = null;
    }
}


class KdTree {
    constructor() {
        this.size = 0;
        this.rootNode = null;
        this.collisions = 0;
    }

    insert(point) {
        /******************************************************************************************
        *   Public interface to put
        ******************************************************************************************/
        if (point === null || point === undefined) throw 'Invalid argument';
        this.rootNode = this.put(this.rootNode, point, null, true);
    }

    put(node, point, _parent, isVertical) {
        /******************************************************************************************
         *  Insert point into KdTree
         *  node (type: Node) - current node to compare new point with
         *  point (type: point) - new point to insert
         *  _parent (type: Node) - parent node of current node
         *  isVertical (type: Boolean) - whether we are dividing h or v at this
         *      recursive level, reversed on each successive call.
         *****************************************************************************************/
        if (node === null) {
            this.size++;
            return new Node(point, _parent);
        }
        if (equalPoints(point, node.point[0])) {
            node.point.push(point);
            this.collisions++;
            return node;
        }
        let cmp;
        if (isVertical) {
            cmp = compareDouble(point.x, node.point[0].x);
        }
        else {
            cmp = compareDouble(point.y, node.point[0].y);
        }
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

    nearestNeighbour(query) {
        /******************************************************************************************
         *  Public interface for getNearest.
         *****************************************************************************************/
        if (query === null || query === undefined) throw 'Invalid argument';
        if (this.size < 2) return null;
        return this.getNearest(this.rootNode.point[0], query, this.rootNode, true);
    }

    getNearest(nearest, queryPoint, node, isVertical) {
        /******************************************************************************************
         *  nearest (type: Point) - nearest point found so far
         *  node (type: Node) - current node to compare queryPoint with
         *  queryPoint (type: Point) - point to find nearest neighbour of
         *  isVertical (type: Boolean) - whether we are dividing h or v at this
         *      recursive level, reversed on each successive call.
         *  As we are finding the nearest neighbour of every point in the tree,
         *      to avoid every query point returning itself, we set the distanceSquared 
         *      method to return Infinity if two of the same point (either the same object 
         *      or another object with the same coordinates) are compared.
         *****************************************************************************************/
        if (node === null) {
            return nearest;
        }
        if (compareDouble(distanceSquared(node.point[0], queryPoint),
                distanceSquared(nearest, queryPoint)) < 0) {
            nearest = node.point[0];
        }
        let cmp;
        if (isVertical) { // take lb branch if node.point is greater than query
            cmp = compareDouble(node.point[0].x, queryPoint.x);
        }
        else {
            cmp = compareDouble(node.point[0].y, queryPoint.y);
        }
        switch(cmp) {
            case 1:
                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
                // if nearest returned is greater than dist to current node, check the other branch
                if (compareDouble(distanceSquared(nearest, queryPoint),
                        this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                    nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
                }
                break;
            default:
                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
                if (compareDouble(distanceSquared(nearest, queryPoint),
                        this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                    nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
                }
                break;
        }
        return nearest;
    }

    otherBranchDistSquared(nearest, node, vertical) {
        let distance;
        if (vertical) distance = Math.abs(node.point[0].x - nearest.x);
        else distance = Math.abs(node.point[0].y - nearest.y);
        return distance * distance;
    }
}


function vReflection(rotation) {
    if (rotation < Math.PI) return Math.PI - rotation;
    else return FULL_ROT - rotation - Math.PI;
}

function hReflection(rotation) {
    if (rotation < Math.PI) return FULL_ROT - rotation;
    else return Math.PI - rotation - Math.Pi;
}

class Point {
    constructor(x, y, context, center, width, height) {
        this.x = x;
        this.y = y;
        if (context) {
            this.width = width;
            this.height = height;
            this.nearest = null;
            this.speed = MIN_SPEED;
            this.rotation = this.angleInRadiansFrom(center);
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

    move(centerOfMass) {
        if (this.y <= 10) {
            this.rotation = hReflection(this.rotation);
            this.y = 20;
            if (this.rotation < 0)
                console.log(this);
        }
        else if (this.y >= this.height - 10) {
            this.rotation = hReflection(this.rotation);
            this.y = this.height - 20;
            if (this.rotation < 0)
                console.log(this);
        }
        if (this.x <= 10) {
            this.rotation = vReflection(this.rotation);
            this.x = 20;
            if (this.rotation < 0)
                console.log(this);
        }
        else if (this.x >= this.width - 10) {
            this.rotation = vReflection(this.rotation);
            this.x = this.width - 20;
            if (this.rotation < 0)
                console.log(this);
        }
//        if (this.nearest && document.querySelector('#collision-opt').checked) {
//            let rot = (compareDouble(this.rotation, this.nearest.rotation) >= 0) ? this.rotation : this.nearest.rotation;
//            this.rotation = ((2 * Math.PI) % (rot + Math.PI)) * 0.9;
//        }
        if (document.querySelector('#fly-opt').checked)
//            this.rotation = (2 * Math.PI) % (this.rotation + centerOfMass.angleInRadiansFrom(this));
//        this.rotation = this.rotateToCenter(centerOfMass);
//        this.rotation = centerOfMass.angleInRadiansFrom(this);
        //if (this.nearest && distanceSquared(this, this.nearest) < this.width*this.width/20) this.rotation = 2*Math.PI % (this.rotation + (this.rotation-this.nearest.rotation)/2);
        if (this.speed < MAX_SPEED) this.speed *= ACCEL;
        else if (this.speed > MAX_SPEED) this.speed = MAX_SPEED;
        else if (this.speed < MIN_SPEED) this.speed = MIN_SPEED;
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);
    }

    rotateToCenter(centerOfMass) {
        let rotationToCenter = centerOfMass.angleInRadiansFrom(this);
        let rotation, dR;
        if (compareDouble(rotationToCenter, this.rotation) >= 0) {
            dR = (rotationToCenter - this.rotation);
            rotation = rotationToCenter - (dR * ROTATION_RATE);
        }
        else {
            dR = (this.rotation - rotationToCenter);
            rotation = this.rotation - (dR * ROTATION_RATE);
        }
        let decel = this.rotation / rotation / 100;
        //this.speed = MAX_SPEED - (MAX_SPEED-MIN_SPEED) * (2*Math.PI/dR/100);
        if (compareDouble(rotation, 0) < 0) return 2*Math.PI - rotation;
        else return rotation;
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
        this.width = document.querySelector('.container').clientWidth;
        this.height = document.querySelector('.container').clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        container.innerHTML = '<canvas id="context" width="' + this.width + '" height="' + this.height + '"></canvas>';
        this.canvas = document.getElementById('context');
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = 'rgb(200, 255, 255)';
        this.context.strokeStyle = '#ff0000';
        this.context.lineWidth = 1;
        this.generatePoints(START_COUNT, this.gaussianRandomPoint);
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

    generatePoints(x, func) {
        let pointFactory = func.bind(this);
        for (var _ = 0; _ < x; _++)
            this.points.push(pointFactory());
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
            //        Animation.rotateToCenter(point, this.centerOfMass);
            //      }
            point.move(this.centerOfMass);
            tree.insert(point);
        }.bind(this));
        this.context.clearRect(0, 0, this.width, this.height);
        this.points.forEach(point=>{
            point.nearest = tree.nearestNeighbour(point);
            point.draw();
            if (document.querySelector('#neighbour-opt').checked) this.drawLine(point.nearest, point);
        });
        if (document.querySelector('#center-opt').checked) drawCenterOfMass(this.context, this.getAveragePosition());
        console.log(tree.collisions);
        tree = null;
        //if (this.doAnim) {
            //window.requestAnimationFrame(function() {
                //this.animate();
            //}.bind(this));
        //}
    }
    static rotateToCenter(point, centerOfMass) {
        var rotationToCenter = centerOfMass.angleInRadiansFrom(point);
        var dRotA = point.getRotation() - rotationToCenter;
        var dRotB = 2 * Math.PI - point.getRotation() + rotationToCenter;
        var rotationDiff = (dRotA > dRotB) ? dRotB : dRotA;
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

