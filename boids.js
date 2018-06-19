const MAX_SPEED = 1.5;
const MIN_SPEED = 1;
const ACCEL = 1.001;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.4;
const START_COUNT = 50;
const FULL_ROT = 2 * Math.PI;
const PROXIMITY = 35;

function equalPoints(p1, p2) {
    return Math.floor(p1.x * 10000) === Math.floor(p2.x * 10000) &&
        Math.floor(p1.y * 10000) === Math.floor(p2.y * 10000);
}

function compareDouble(a, b) {
    a = Math.floor(a * 1000);
    b = Math.floor(b * 1000);
    if (a === b) return 0;
    else if (a < b) return -1;
    return 1;
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
        *   Takes a Point or array of Points.
        ******************************************************************************************/
        if (point === null || point === undefined) throw 'Invalid argument';
        if (Array.isArray(point)) {
            point.forEach(p=>{
                if (!p instanceof Point || p === null) throw 'Invalid argument';
                this.rootNode = this.put(this.rootNode, p, null, true);
            });
        }
        else {
            this.rootNode = this.put(this.rootNode, point, null, true);
        }
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
        if (cmp === -1) {
            node.lb = this.put(node.lb, point, node, !isVertical);
        }
        else {
            node.rt = this.put(node.rt, point, node, !isVertical);
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
        if (cmp === 1) {
            nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
            // if nearest returned is greater than dist to current node, check the other branch
            if (compareDouble(distanceSquared(nearest, queryPoint),
                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
            }
        }
        else {
            nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
            if (compareDouble(distanceSquared(nearest, queryPoint),
                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
            }
        }
        return nearest;
    }

    otherBranchDistSquared(nearest, node, vertical) {
        let distance;
        if (vertical) distance = Math.abs(node.point[0].x - nearest.x);
        else distance = Math.abs(node.point[0].y - nearest.y);
        return distance * distance;
    }

    range(rect) {
        if (rect === null) throw 'Invalid argument';
        let stack = [];
        this.getRange(this.rootNode, stack, rect, true);
        return stack;
    }

    getRange(node, stack, rect, isVertical) {
        /*
         */
        if (node === null) return;
        let cmp;
        if (rect.contains(node.point[0])) {
            node.point.forEach(p=>stack.push(p));
            cmp = 0;
        }
        else if (isVertical) {
            if (compareDouble(node.point[0].x, rect.xmin) >= 0 &&
                    compareDouble(node.point[0].x, rect.xmin) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (compareDouble(node.point[0].x, rect.xmin) < 0) ? 1 : -1;
            }
        }
        else {
            if (compareDouble(node.point[0].y, rect.ymin) >= 0 &&
                    compareDouble(node.point[0].y, rect.ymax) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (compareDouble(node.point[0].y, rect.ymin) < 0) ? 1 : -1;
            }
        }
        if (cmp === 0) {
            this.getRange(node.lb, stack, rect, !isVertical);
            this.getRange(node.rt, stack, rect, !isVertical);
        }
        else if (cmp === -1) {
            this.getRange(node.lb, stack, rect, !isVertical);
        }
        else {
            this.getRange(node.rt, stack, rect, !isVertical);
        }
    }
}


class Rect {
    constructor(xmin, ymin, xmax, ymax) {
        if (xmin === undefined || xmin === null || ymin === undefined || ymin === null ||
            xmax === undefined || xmax === null || ymax === undefined || ymax === null) {
            throw 'Invalid argument';
        }
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
    }

    contains(point) {
        return point.x >= this.xmin && point.x <= this.xmax &&
            point.y >= this.ymin && point.y <= this.ymax;
    }
}


class Point {
    constructor(x, y, id, context, center, width, height) {
        this.x = x;
        this.y = y;
        this.id = id;
        if (context) {
            this.width = width;
            this.height = height;
            this.nearest = null;
            this.speed = MIN_SPEED;
            this.center = new Point(center.x, center.y);
            this.rotation = this.angleInRadiansFrom(center);
            this.context = context;
            this.nextRot = this.rotation;
        }
    }
    angleInRadiansFrom(that) {
        return Math.atan2(this.y - that.y, this.x - that.x);
    }

    updateSpeed(x) { this.speed = x; }

    updateRotation(x) { this.rotation = x; }

    getRotation() { return this.rotation; }

    getSpeed() { return this.speed; }

    move(nextRot, speed) {
        this.rotation = (this.rotation + nextRot) / 2;
        let dx = this.getDx();
        let dy = this.getDy();
        if (this.x + dx > this.width || this.x + dx < 0 ) {
            dx = -dx;
            this.rotation = Math.PI - this.rotation;
        }
        if (this.y + dy > this.height || this.y + dy < 0) {
            dy = -dy;
            this.rotation = -this.rotation;
        }
        if (speed < MAX_SPEED) {
            this.speed = speed * ACCEL;
        }
        else if (speed > MAX_SPEED) {
            this.speed = MAX_SPEED;
        }
        else if (speed < MIN_SPEED) {
            this.speed = MIN_SPEED;
        }
        this.x += dx;
        this.y += dy;
    }

    getDx() {
        return this.speed * Math.cos(this.rotation);
    }

    getDy() {
        return this.speed * Math.sin(this.rotation);
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
}

function drawCenterOfMass(context, point) {
    context.fillStyle = 'rgb(200, 255, 200)';
    context.beginPath();
    context.arc(point.x, point.y, 10, 0, 2*Math.PI, true);
    context.fill();
    context.fillStyle = 'rgb(200, 255, 255)';
}

class Animation {
    constructor(container0, container1) {
        this.points = [];
        this.width = document.querySelector('.container0').clientWidth;
        this.height = document.querySelector('.container0').clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        container0.innerHTML = '<canvas id="point_ctx" width="' + this.width + '" height="' + this.height + '"></canvas>';
        container1.innerHTML = '<canvas id="line_ctx" width="' + this.width + '" height="' + this.height + '"></canvas>';
        this.canvas0 = document.querySelector('#point_ctx');
        this.canvas1 = document.querySelector('#line_ctx');
        this.line_ctx = this.canvas0.getContext('2d');
        this.point_ctx = this.canvas1.getContext('2d');
        this.point_ctx.fillStyle = 'rgb(200, 255, 255)';
        this.generatePoints(START_COUNT, this.gaussianRandomPoint);
        this.canvas1.addEventListener('click', function(elt){
            this.pointFromClick(elt);
        }.bind(this));
        this.doAnim = true;
        document.querySelector('#stop').addEventListener('click', function() {
            this.doAnim = !this.doAnim;
            if (this.doAnim) { this.animate(); }
        }.bind(this));
    }

    newPoint(x, y) {
        return new Point(x, y, this.points.length, this.point_ctx, this.center, this.width, this.height);
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
        return this.newPoint(Animation.gaussianRandom(this.width),
                             Animation.gaussianRandom(this.height));
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
        let tree = new KdTree();
        let neighbourDrawn = [];
        this.points.forEach(function(point){
            tree.insert(point);
        });
        this.point_ctx.clearRect(0, 0, this.width, this.height);
        this.line_ctx.clearRect(0, 0, this.width, this.height);
        this.points.forEach(point=>{
            point.nearest = tree.nearestNeighbour(point);
            this.drawPoint(point, this.point_ctx);
            if (document.querySelector('#neighbour-opt').checked &&
                    neighbourDrawn[point.id] === undefined) {
                this.drawLine(point.nearest, point, this.line_ctx);
                neighbourDrawn[point.id] = true;
            }
            let nextVelocity = {'speed': null, 'rotation': null};
            if (document.querySelector('#flock-opt').checked &&
                    point.x > 50 && point.x < this.width - 50 &&
                    point.y > 50 && point.y < this.height - 50) {
                nextVelocity = this.getRangeAverages(point, tree);
            }
            else if (distanceSquared(point, point.nearest) < 5) {
                nextVelocity.rotation = (point.angleInRadiansFrom(point.nearest) + point.rotation) / 2;
                nextVelocity.speed = MIN_SPEED;
            }
            else {
                nextVelocity.rotation = point.rotation;
                nextVelocity.speed = point.speed;
            }
            point.move(nextVelocity.rotation, nextVelocity.speed);
        });
        if (this.doAnim) {
           window.requestAnimationFrame(function() {
                this.animate();
            }.bind(this));
        }
    }

    drawPoint(point, context) {
        context.beginPath();
        context.arc(point.x, point.y, point.speed*2.5, 0, 2*Math.PI, true);
        context.fill();
    }

    getRangeAverages(p, tree) {
        let rect = new Rect(
            p.x - PROXIMITY, p.y - PROXIMITY,
            p.x + PROXIMITY, p.y + PROXIMITY
        )
        let neighbours = tree.range(rect);
        if (neighbours.length < 2) {
            return {'speed': p.speed, 'rotation': p.rotation};
        }
        let avgRot = neighbours.map(x=>x.rotation).reduce((acc, x)=>acc + x) / neighbours.length;
        let avgSpd = neighbours.map(x=>x.speed).reduce((acc, x)=>acc + x) / neighbours.length;
        return {'speed': avgSpd, 'rotation': avgRot};
    }

    drawLine(b1, b2, context) {
        context.strokeStyle = 'rgb(100, 155, 155)';
        context.beginPath();
        context.moveTo(b1.x, b1.y);
        context.lineTo(b2.x, b2.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
}


window.addEventListener("load", function() {
    let container0 = document.querySelector('#container0');
    let container1 = document.querySelector('#container1');
    let anim = new Animation(container0, container1);
    anim.animate();
});
