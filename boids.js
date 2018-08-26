const MAX_SPEED = 1.5;
const MIN_SPEED = 1;
const ACCEL = 1.001;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.4;
const START_COUNT = 100;
const FULL_ROT = 2 * Math.PI;
const PROXIMITY = 20;
const G = 0.5;
const C = 0.09;

function equalPoints(p1, p2) {
    return Math.floor(p1.position.x * 10000) === Math.floor(p2.position.x * 10000) &&
        Math.floor(p1.position.y * 10000) === Math.floor(p2.position.y * 10000);
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
    let dx = Math.abs(p.position.x - q.position.x);
    let dy = Math.abs(p.position.y - q.position.y);
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
            cmp = compareDouble(point.position.x, node.point[0].position.x);
        }
        else {
            cmp = compareDouble(point.position.y, node.point[0].position.y);
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
            cmp = compareDouble(node.point[0].position.x, queryPoint.position.x);
        }
        else {
            cmp = compareDouble(node.point[0].position.y, queryPoint.position.y);
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
        if (vertical) distance = Math.abs(node.point[0].position.x - nearest.position.x);
        else distance = Math.abs(node.point[0].position.y - nearest.position.y);
        return distance * distance;
    }

    range(rect) {
        /******************************************************************************************
         * rect: 2d Rect object
         * Return an array of all points within the 2d range. Interface to KdTree.getRange
         *****************************************************************************************/
        if (rect === null) throw 'Invalid argument';
        let stack = [];
        this.getRange(this.rootNode, stack, rect, true);
        return stack;
    }

    getRange(node, stack, rect, isVertical) {
        if (node === null) return;
        let cmp;
        if (rect.contains(node.point[0])) {
            node.point.forEach(p=>stack.push(p));
            cmp = 0;
        }
        else if (isVertical) {
            if (compareDouble(node.point[0].position.x, rect.xmin) >= 0 &&
                    compareDouble(node.point[0].position.x, rect.xmin) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (compareDouble(node.point[0].position.x, rect.xmin) < 0) ? 1 : -1;
            }
        }
        else {
            if (compareDouble(node.point[0].position.y, rect.ymin) >= 0 &&
                    compareDouble(node.point[0].position.y, rect.ymax) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (compareDouble(node.point[0].position.y, rect.ymin) < 0) ? 1 : -1;
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
        return point.position.x >= this.xmin && point.position.x <= this.xmax &&
            point.position.y >= this.ymin && point.position.y <= this.ymax;
    }
}


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static checkArgType(other) {
        if (!(other instanceof Vector)) {
            throw 'Invalid arg';
        }
    }

    limit(max) {
        if (this.length() > max) {
            this.normalize();
            this.scale(max);
        }
    }

    static add(v1, v2) {
        return new Vector(
            v1.x + v2.x,
            v1.y + v2.y
        );
    }

    static subtract(v1, v2) {
        return new Vector(
            v1.x - v2.x, v1.y - v2.y
        );
    }

    static divide(vector, scalar) {
        return new Vector(vector.x / scalar, vector.y / scalar);
    }

    add(other) {
        Vector.checkArgType(other);
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other) {
        Vector.checkArgType(other);
        this.x -= other.x;
        this.y -= other.y;
    }

    scale(scalar) {
        if (isNaN(scalar)) {
            throw 'Invalid argument';
        }
        this.x *= scalar;
        this.y *= scalar;
    }

    divideBy(scalar) {
        if (isNaN(scalar)) {
            throw 'Invalid argument';
        }
        this.x /= scalar;
        this.y /= scalar;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        const m = this.length();
        if (m) {
            this.divideBy(m);
        }
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}

class Point {
    constructor(x, y, id, context, center, width, height) {
        this.mass = Math.floor(Math.random() * (7 - 3) + 3);
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.lastPos = null;
        this.accel = new Vector(0.001, 0.001);
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

    applyForce(force) {
        Vector.checkArgType(force);
        const f = Vector.divide(force, this.mass);
        this.accel.add(f);
    }

    angleInRadiansFrom(that) {
        return Math.atan2(
            this.position.y - that.position.y,
            this.position.x - that.position.x
        );
    }

    move() {
        this.velocity.add(this.accel);
        this.velocity.limit(5);
        this.position.add(this.velocity);
        this.accel.scale(0);
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
        if (this.position.y < that.position.y) return -1;
        else if (this.position.y > that.position.y) return 1;
        else if (this.position.x < that.position.x) return -1;
        else if (this.position.x > that.position.x) return 1;
        else return 0;
    }

    slopeTo(that) {
        if (this.position.x == that.position.x &&
            this.position.y == that.position.y)
            return -Infinity;
        else if (this.position.y == that.position.y) return 0.0;
        else if (this.position.x == that.position.x) return Infinity;
        else return (that.position.y - this.position.y) /
            (that.position.x - this.position.x);
    }
}

class Animation {
    constructor(container0, container1) {
        this.points = [];
        this.width = document.querySelector('.container0').clientWidth;
        this.height = document.querySelector('.container0').clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.center = this.newPoint(this.center.x, this.center.y);
        this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        container0.innerHTML = `<canvas id="point_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        container1.innerHTML = `<canvas id="line_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        this.canvas0 = document.querySelector('#point_ctx');
        this.canvas1 = document.querySelector('#line_ctx');
        this.line_ctx = this.canvas0.getContext('2d');
        this.point_ctx = this.canvas1.getContext('2d');
        this.point_ctx.fillStyle = 'rgb(200, 255, 255)';
        this.generatePoints(START_COUNT, this.gaussianRandomPoint);
        this.canvas1.addEventListener('click', (elt)=> this.pointFromClick(elt));
        this.doAnim = true;
        document.querySelector('#stop').addEventListener('click', ()=> {
            this.doAnim = !this.doAnim;
            if (this.doAnim) this.animate();
        });
    }

    newPoint(x, y) {
        return new Point(x, y, this.points.length, this.point_ctx, this.center, this.width, this.height);
    }

    pointFromClick(elt) {
        this.points.push(this.newPoint(elt.clientX, elt.clientY));
    }

    generatePoints(x, func) {
        let pointFactory = func.bind(this);
        for (var _ = 0; _ < x; _++) {
            this.points.push(pointFactory());
        }
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
            const pos = point.position;
            if (pos.x < 0) {
                const edge1 = Vector.subtract(new Vector(0, pos.y), pos);
                const mag = edge1.length();
                edge1.normalize();
                edge1.scale(mag);
                point.applyForce(edge1);
            }
            else if (pos.x > this.width) {
                const edge1 = Vector.subtract(new Vector(this.width, pos.y), pos);
                const mag = edge1.length();
                edge1.normalize();
                edge1.scale(mag);
                point.applyForce(edge1);
            }
            if (pos.y < 0) {
                const edge2 = Vector.subtract(new Vector(pos.x, 0), pos);
                const mag = edge2.length();
                edge2.normalize();
                edge2.scale(mag);
                point.applyForce(edge2);
            }
            else if (pos.y > this.height) {
                const edge2 = Vector.subtract(new Vector(pos.x, this.height), pos);
                const mag = edge2.length();
                edge2.normalize();
                edge2.scale(mag);
                point.applyForce(edge2);
            }
            //if (point.nearest) {
                //const neighbourGrav = this.getNeighbourGrav(point);
                //point.applyForce(neighbourGrav);
            //}
            //const resistance = this.getResistance(point);
            //point.applyForce(resistance);
            const centerGrav = this.getCenterGrav(point);
            point.applyForce(centerGrav);
            point.move();
        });
        if (this.doAnim) {
           window.requestAnimationFrame(()=> this.animate());
        }
    }

    getCenterGrav(point) {
        const dir = Vector.subtract(this.center.position, point.position);
        const mag = dir.length();
        dir.normalize();
        const grav = (G * point.mass * 5) / (mag * mag);
        dir.scale(grav);
        return dir;
    }

    getResistance(point) {
        const speed = point.velocity.length();
        // get half circumference of circle for frontal area - mass is radius
        const frontalArea = Math.PI * point.mass;
        const dragMagnitude = frontalArea * C * speed * speed;
        const drag = point.velocity.copy();
        drag.normalize();
        drag.scale(-1);
        drag.scale(dragMagnitude);
        return drag;
    }

    getNeighbourGrav(point) {
        const pos = point.position;
        const neighbour = point.nearest.position;
        const dir = Vector.subtract(neighbour, pos);
        const dist = dir.length();
        const m = (G * point.mass * point.nearest.mass) / (dist * dist);
        dir.normalize();
        dir.scale(m);
        return dir;
    }

    edgeGrav(point) {
        const north = Vector.subtract(point.position, new Vector(point.position.x, 0));
        const dNorth = north.length()
        const fNorth = (G * point.mass * 20) / dNorth * dNorth;
        north.normalize();
        north.scale(fNorth);
        const east = Vector.subtract(point.position, new Vector(this.width, point.position.y));
        const dEast = east.length()
        const fEast = (G * point.mass * 20) / dEast * dEast;
        east.normalize();
        east.scale(fEast);
        const south = Vector.subtract(point.position, new Vector(point.position.x, this.height));
        const dSouth = south.length()
        const fSouth = (G * point.mass * 20) / dSouth * dSouth;
        south.normalize();
        south.scale(fSouth);
        const west = Vector.subtract(point.position, new Vector(0, point.position.y));
        const dWest = west.length()
        const fWest = (G * point.mass * 20) / dWest * dWest;
        west.normalize();
        west.scale(fWest);
        const min = Math.min(dNorth, dEast, dSouth, dWest);
        let selected = null;
        switch (min) {
            case dNorth:
                selected = north;
                break;
            case dEast:
                selected = east;
                break;
            case dSouth:
                selected = south;
                break;
            case dWest:
                selected = west;
                break;
        }
        selected.scale(-1);
        return selected;
    }

    drawPoint(point, context) {
        context.beginPath();
        context.arc(point.position.x, point.position.y, point.mass, 0, 2*Math.PI, true);
        context.fill();
    }

    drawLine(b1, b2, context) {
        context.strokeStyle = 'rgb(100, 155, 155)';
        context.beginPath();
        context.moveTo(b1.position.x, b1.position.y);
        context.lineTo(b2.position.x, b2.position.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
 
    getRangeAverages(p, tree) {
        const rect = new Rect(
            p.position.x - PROXIMITY, p.position.y - PROXIMITY,
            p.position.x + PROXIMITY, p.position.y + PROXIMITY
        )
        const neighbours = tree.range(rect);
        if (neighbours.length < 2) {
            return new Vector(1, 1);
        }
        const vectors = neighbours.map(x=>x.position);
        const sumVectors = vectors.reduce((acc, next) => {
            return Vector.add(acc, next);
        }, new Vector(0, 0));
        const avg = Vector.divide(sumVectors, neighbours.length);
        return avg;
    }

    drawCenterOfMass(context, point) {
        context.fillStyle = 'rgb(200, 255, 200)';
        context.beginPath();
        context.arc(point.position.x, point.position.y, 10, 0, 2*Math.PI, true);
        context.fill();
        context.fillStyle = 'rgb(200, 255, 255)';
    }
}


window.addEventListener("load", function() {
    let container0 = document.querySelector('#container0');
    let container1 = document.querySelector('#container1');
    let anim = new Animation(container0, container1);
    anim.animate();
});
