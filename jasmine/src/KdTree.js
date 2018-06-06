const MIN_SPEED = 1;

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
    }

    insert(point) {
        if (point === null || point === undefined) throw 'Invalid argument';
        this.rootNode = this.put(this.rootNode, point, null, true);
    }

    put(node, point, _parent, isVertical) {
        if (node === null) {
            this.size++;
            return new Node(point, _parent);
        }
        if (equalPoints(point, node.point[0])) {
            node.point.push(point);
            return node;
        }
        let cmp = (isVertical) ? compareDouble(point.x, node.point[0].x) : compareDouble(point.y, node.point[0].y);
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
         *  To avoid returning the query point if it is root, first check, then assign first
         *      "nearest" value to rootNode.lb/rt depending on which is closer.
         *****************************************************************************************/
        if (query === null || query === undefined) throw 'Invalid argument'; 
        if (this.size < 2) return null;
        let nearest = this.rootNode.point[0];
        let dLb, dRt;
        if (this.rootNode.point.indexOf(query) > -1) {
            if (this.rootNode.lb === null) {
                nearest = this.rootNode.rt.point[0];
            }
            else if (this.rootNode.rt === null) {
                nearest = this.rootNode.lb.point[0];
            }
            else {
                dLb = distanceSquared(query, this.rootNode.lb.point[0]);
                dRt = distanceSquared(query, this.rootNode.rt.point[0]);
                nearest = (compareDouble(dLb, dRt) < 0) ? this.rootNode.lb.point[0] : this.rootNode.rt.point[0];
            }
        }
        return this.getNearest(nearest, query, this.rootNode, true);
    }

    getNearest(nearest, queryPoint, node, isVertical) {
        /******************************************************************************************
         *   nearest (type: Point) - nearest point found so far
         *   node (type: Node) - current node to compare queryPoint with
         *   queryPoint (type: Point) - point to find nearest neighbour of
         *   isVertical (type: Boolean) - whether we are dividing h or v at this
         *      recursive level, reversed on each successive call.
         *****************************************************************************************/
        if (node === null || node.point[0] === queryPoint && node.lb === null && node.rt === null)
            return nearest;
        if (node.point.indexOf(queryPoint) === -1 && 
                compareDouble(distanceSquared(node.point[0], queryPoint), distanceSquared(nearest, queryPoint)) < 0)
            nearest = node.point[0];
        let cmp, next;
        if (isVertical) { // take lb branch if node.point is greater than query
            cmp = compareDouble(node.point[0].x, queryPoint.x);
        }
        else {
            cmp = compareDouble(node.point[0].y, queryPoint.y);
        }
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
}
