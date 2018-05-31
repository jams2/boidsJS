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
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        if (context) this.context = context;
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
}

class Animation {
    constructor(container) {
        this.points = [];
        this.tree = new KdTree();
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
        this.generatePoints(50);
        this.canvas.addEventListener('click', function(elt){
            this.pointFromClick(elt);
            // this.generatePoints(20, this.gaussianRandomPoint);
        }.bind(this));
        this.drawPoints();
        this.points.forEach(point=>{
            let nearest = this.tree.getNearest(this.tree.root.point, point, this.tree.root, true);
            this.drawLine(nearest, point);
        });
    }

    size() { return this.points.length; }
    newPoint(x, y) {
        return new Point(x, y, this.context, this.center, this.width, this.height);
    }

    pointFromClick(elt) {
        this.points.push(this.newPoint(elt.clientX, elt.clientY));
    }

    generatePoints(x) {
        for (var _ = 0; _ < x; _++) {
            let newPoint = this.gaussianRandomPoint();
            this.points.push(newPoint);
            this.tree.insert(newPoint);
        }
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

    isOutOfBounds(point) {
        return (point.x >= this.width || point.x <= 0 || point.y >= this.height || point.y <= 0);
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

window.addEventListener("load", function() {
    context = new Animation(document.querySelector('body'));
});
