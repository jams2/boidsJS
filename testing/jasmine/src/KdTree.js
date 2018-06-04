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
        this.rootNode = null;
    }
    insert(point) {
        this.rootNode = this.put(this.rootNode, point, null, true);
    }
    put(node, point, _parent, isVertical) {
        if (node === null) {
            this.size++;
            return new Node(point, _parent);
        }
        if (equalPoints(point, node.point)) {
            point.speed = MIN_SPEED;
            if (isVertical) point.x += 2;
            else point.y += 2;
            this.insert(point);
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
    nearestNeighbour(query) {
        if (this.size < 2) return null;
        return this.getNearest(this.rootNode.point, query, this.rootNode, true);
    }
    getNearest(nearest, queryPoint, node, isVertical) {
        // node - next node to compare queryPoint against
        if (node === null || node.point === queryPoint && node.lb === null && node.rt === null)
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
}
