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
         * Return an array of all points within the 2d range. Interface to KdTree.getRange.
         * If called in reference to a point, e.g. in Point.getNeighhbours, that point will
         * be included in the returned stack.
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

export { Node, KdTree, equalPoints, compareDouble, distanceSquared };
