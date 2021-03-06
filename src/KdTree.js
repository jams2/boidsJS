class Node {
    constructor(newPoint, parentNode) {
        this.points = [newPoint];
        this.parentNode = parentNode;
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
        // Public interface to KdTree.put
        if (point === null || point === undefined) throw 'Invalid argument';
        this.rootNode = this.put(this.rootNode, point, null, true);
    }

    put(currentNode, newPoint, parentNode, isVertical) {
        if (currentNode === null) {
            this.size++;
            return new Node(newPoint, parentNode);
        }
        if (equalPoints(newPoint, currentNode.points[0])) {
            currentNode.points.push(newPoint);
            return currentNode;
        }
        let cmp;
        if (isVertical) {
            cmp = comparePosition(newPoint.position.x, currentNode.points[0].position.x);
        } else {
            cmp = comparePosition(newPoint.position.y, currentNode.points[0].position.y);
        }
        if (cmp === -1) {
            currentNode.lb = this.put(currentNode.lb, newPoint, currentNode, !isVertical);
        } else {
            currentNode.rt = this.put(currentNode.rt, newPoint, currentNode, !isVertical);
        }
        return currentNode;
    }

    nearestNeighbour(query) {
        // Public interface for getNearest.
        if (query === null || query === undefined) throw 'Invalid argument';
        if (this.size < 2) return null;
        return this.getNearest(this.rootNode.points[0], query, this.rootNode, true);
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
        if (comparePosition(distanceSquared(node.points[0], queryPoint),
                distanceSquared(nearest, queryPoint)) < 0) {
            nearest = node.points[0];
        }
        let cmp;
        if (isVertical) { // take lb branch if node.point is greater than query
            cmp = comparePosition(node.points[0].position.x, queryPoint.position.x);
        }
        else {
            cmp = comparePosition(node.points[0].position.y, queryPoint.position.y);
        }
        if (cmp === 1) {
            nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
            // if nearest returned is greater than dist to current node, check the other branch
            if (comparePosition(distanceSquared(nearest, queryPoint),
                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
            }
        } else {
            nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);
            if (comparePosition(distanceSquared(nearest, queryPoint),
                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {
                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);
            }
        }
        return nearest;
    }

    otherBranchDistSquared(nearest, node, vertical) {
        let distance;
        if (vertical) distance = Math.abs(node.points[0].position.x - nearest.position.x);
        else distance = Math.abs(node.points[0].position.y - nearest.position.y);
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
        if (rect.contains(node.points[0])) {
            let i = 0;
            while (i < node.points.length) {
                stack.push(node.points[i]);
                i += 1;
            }
            cmp = 0;
        }
        else if (isVertical) {
            if (comparePosition(node.points[0].position.x, rect.xmin) >= 0 &&
                    comparePosition(node.points[0].position.x, rect.xmin) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (comparePosition(node.points[0].position.x, rect.xmin) < 0) ? 1 : -1;
            }
        }
        else {
            if (comparePosition(node.points[0].position.y, rect.ymin) >= 0 &&
                    comparePosition(node.points[0].position.y, rect.ymax) <= 0) {
                cmp = 0;
            }
            else {
                cmp = (comparePosition(node.points[0].position.y, rect.ymin) < 0) ? 1 : -1;
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
    return p1.position.x === p2.position.x &&
        p1.position.y === p2.position.y;
}


function comparePosition(a, b) {
    if (a === b) return 0;
    else if (a < b) return -1;
    return 1;
}


function distanceSquared(p, q) {
    if (p.id === q.id || equalPoints(p, q)) return Infinity;
    const dx = Math.abs(p.position.x - q.position.x);
    const dy = Math.abs(p.position.y - q.position.y);
    return dx*dx + dy*dy;
}

export { Node, KdTree, equalPoints, comparePosition, distanceSquared };
