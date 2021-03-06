function randInt(max) { return Math.floor(Math.random() * max); }

describe('Test range query', function() {
    var tree;
    var points;
    var r;
    var range;
    var notInRange;
    beforeAll(function() {
        tree = new KdTree();
        points = [
            new Point(1, 2), new Point(5, 5), new Point(0, 0), new Point(10, 10),
            new Point(9, 8), new Point(5, 5), new Point(1, 2), new Point(7, 9),
            new Point(9.99, 9.99), new Point(9.99, 4.99)
        ] 
        tree.insert(points);
        r = new Rect(5, 5, 10, 10);
        range = tree.range(r);
        notInRange = [];
        points.forEach(point=> {
            if (range.indexOf(point) === -1) notInRange.push(point);
        });
    });
    it('Should handle null argument', function() {
        expect(function(){ tree.range(null); }).toThrow('Invalid argument');
    });
    it('Should return all points in the given range', function() {
        expect(range.length).toBe(6);
        range.forEach(point=> {
            expect(points.indexOf(point)).not.toEqual(-1);
        });
    });
    it('Should not return any points not in the range', function() {
        expect(notInRange.length).toEqual(4);
    });
});

describe('Test Rect.contains method', function() {
    var p;
    var rect;
    beforeEach(function() {
        p = new Point(5, 5);
        rect = new Rect(0, 0, 10, 10);
    });
    it('Should return true for points in the middle', function() {
        expect(rect.contains(p)).toBe(true);
    });
    it('Should return true for points on boundary', function() {
        let q = new Point(0, 5);
        expect(rect.contains(q)).toBe(true);
        let r = new Point(5, 0);
        expect(rect.contains(r)).toBe(true);
        let s = new Point(10, 10);
        expect(rect.contains(s)).toBe(true);
        let t = new Point(0, 0);
        expect(rect.contains(t)).toBe(true);
    });
    it('Should return false on outlying points', function() {
        let q = new Point(-1, -1);
        expect(rect.contains(q)).toBe(false);
        let r = new Point(11, 0);
        expect(rect.contains(r)).toBe(false);
        let s = new Point(15, 15);
        expect(rect.contains(s)).toBe(false);
    });
});

describe('Test Rect constructor', function() {
    it('Should handle null argument', function() {
        expect(function(){ return new Rect(null, null, null, null); }).toThrow('Invalid argument');
    });
    it('Should correctly store fields', function() {
        let r = new Rect(1, 2, 3, 4);
        expect(r.xmin).toEqual(1);
        expect(r.ymin).toEqual(2);
        expect(r.xmax).toEqual(3);
        expect(r.ymax).toEqual(4);
    });
});

describe('Test nearest neighbour query', function() {
    var tree;
    var p;
    beforeEach(function() {
        tree = new KdTree();
        p = new Point(8, 9);
    });
    it('Should handle a point with equidistant neighbours', function(){});
    it('Should always return the correct nearest neighbour', function(){
        let points = [];
        for (var _ = 0; _ < 2000; _++) {
            p = new Point(randInt(1000), randInt(1000));
            tree.insert(p);
        }
        points.forEach(point=>{
            expect(tree.nearestNeighbour(new Point(point.x+0.1, point.y+0.1))).toBe(point);
        });
    });
    it('Should return null if querying nearest neighbour of the only inserted point', function(){
        tree.insert(p);
        expect(tree.nearestNeighbour(p)).toBe(null);
    });
    it('Should return null if querying empty tree', function() {
        expect(tree.nearestNeighbour(p)).toBe(null);
    });
    it('Should throw an error if passed a null argument', function() {
        expect(function(){tree.nearestNeighbour(null);}).toThrow('Invalid argument');
        let q;
        expect(function(){tree.nearestNeighbour(q);}).toThrow('Invalid argument');
    });
    it('A point should not be its own nearest neighbour, when that point is root', function() {
        tree.insert(p);
        let q = new Point(9, 9);
        tree.insert(q);
        expect(tree.nearestNeighbour(p)).not.toBe(p);
    });
    it('A point should not be its own nearest neighbour, when that point is not root', function() {
        let q = new Point(9, 9);
        tree.insert(q);
        tree.insert(p);
        expect(tree.nearestNeighbour(p)).not.toBe(p);
    });
    it('Should return correct neighbour when query is root, nearest is right branch', function() {
            tree.insert(p);
            let q = new Point(8.5, 9); // right branch, closer
            let r = new Point(7, 9); // left branch
            tree.insert(q);
            tree.insert(r);
            expect(tree.nearestNeighbour(p)).toBe(q);
    });
    it('Should return correct neighbour when query is root, nearest is left branch', function() {
            tree.insert(p);
            let q = new Point(10, 9);
            let r = new Point(7, 9);
            tree.insert(q);
            tree.insert(r);
            expect(tree.nearestNeighbour(p)).toBe(r);
    });
    it('Should return correct nearest neighbour in a large tree, when query is root', function() {
        tree.insert(p);
        for (var i = 0; i < 150; i++) {
            tree.insert(new Point(randInt(1000), randInt(1000)));
        }
        let q = new Point(8.5, 9);
        tree.insert(q);
        expect(tree.nearestNeighbour(p)).toBe(q);
    });
    it('Should return correct nearest neighbour in a large tree, when query is not root', function() {
        for (var i = 0; i < 150; i++) {
            tree.insert(new Point(randInt(1000), randInt(1000)));
        }
        tree.insert(p);
        let q = new Point(8.5, 9);
        tree.insert(q);
        expect(tree.nearestNeighbour(p)).toBe(q);
    });
    it('Should handle multiple points in same node that are nearest neighbour', function(){});
});

describe('Test insert method', function() {
    var tree;
    beforeEach(function() {
        tree = new KdTree();
    });
    afterEach(function() {
        tree = null;
    });
    it('Should increment collision counter if duplicate points inserted', function() {
        let p = new Point(13, 21);
        let q = new Point(13, 21);
        let r = new Point(13, 21);
        let s = new Point(13, 21);
        tree.insert(p);
        tree.insert(q);
        expect(tree.collisions).toEqual(1);
        tree.insert(r);
        expect(tree.collisions).toEqual(2);
        tree.insert(s);
        expect(tree.collisions).toEqual(3);
    });
    it('Should have the correct count after no insertions', function() {
        expect(tree.size).toEqual(0);
    });
    it('Should have the correct count after 1 insertion', function() {
        let p = new Point(0, 0);
        tree.insert(p);
        expect(tree.size).toEqual(1);
    });
    it('Should have the correct count after a few insertions', function() {
        for (var i = 0; i < 15; i++) {
            tree.insert(new Point(Math.random, Math.random));
        }
        expect(tree.size).toBe(15);
    });
    it('Should have the correct count after many insertions', function() {
        for (var i = 0; i < 150; i++) {
            tree.insert(new Point(Math.random, Math.random));
        }
        expect(tree.size).toBe(150);
    });
    it('Should have the correct count after a large number of insertions', function() {
        for (var i = 0; i < 1500; i++) {
            tree.insert(new Point(Math.random, Math.random));
        }
        expect(tree.size).toBe(1500);
    });
    it('Should throw error on null argument', function() {
        expect(function(){ tree.insert(null); }).toThrow('Invalid argument');
        let p;
        expect(function(){ tree.insert(p); }).toThrow('Invalid argument');
    });
    it('Should append new point to array in Node if duplicate point inserted', function() {
        let p = new Point(0, 0);
        let q = new Point(0, 0);
        tree.insert(p);
        tree.insert(q);
        expect(typeof tree.rootNode.point).toBe('object');
        expect(tree.rootNode.point.length).toEqual(2);
    });
});

describe('Test KdTree constructor', function() {
    var tree;
    beforeEach(function() {
        tree = new KdTree();
    });
    it('Should have a null root after construction and no insertions', function() {
        expect(tree.rootNode).toBe(null);
    });
    it('Should not be null after construction', function() {
        expect(tree).not.toBe(null);
    });
    it('Should define the first point inserted as root', function() {
        let p = new Point(0, 0);
        tree.insert(p);
        expect(tree.rootNode.point[0]).toEqual(p);
    });
});

describe('Test distanceSquared', function() {
    var p = new Point(0, 0);
    var q = new Point(1, 1);
    var r = new Point(2, 2);
    it('Should calculate the correct distances', function() {
        expect(distanceSquared(p, q)).toBe(2);
        expect(distanceSquared(p, r)).toBe(8);
        expect(distanceSquared(p, p)).toBe(Infinity);
    });
});
describe('Test equalPoints to 4 decimal places', function() {
    it('Should correctly evaluate equal points with integers', function() {
        let p = new Point(0, 0);
        let q = new Point(0, 0);
        expect(equalPoints(p, q)).toBe(true);
        p = new Point(-1, 0);
        q = new Point(-1, 0);
        expect(equalPoints(p, q)).toBe(true);
        p = new Point(-1, -5);
        q = new Point(-1, -5);
        expect(equalPoints(p, q)).toBe(true);
        p = new Point(1, 5);
        q = new Point(1, 5);
        expect(equalPoints(p, q)).toBe(true);
    });
    it('Should correctly evaluate equal points with floats', function() {
        let p = new Point(0.456, 0.4569);
        let q = new Point(0.456, 0.4569);
        expect(equalPoints(p, q)).toBe(true);
        p = new Point(-1.9999, 0.33334);
        q = new Point(-1.9999, 0.33339);
        expect(equalPoints(p, q)).toBe(true);
        p = new Point(-1.1156, -5.11566);
        q = new Point(-1.1156, -5.11564);
        expect(equalPoints(p, q)).toBe(true);
    });
    it('Should correctly evaluate inequal points', function() {
        let p = new Point(0.456, 0.556);
        let q = new Point(0.456, 0.456);
        expect(equalPoints(p, q)).toBe(false);
        p = new Point(-1.9999, 0.3343);
        q = new Point(-1.9993, 0.3333);
        expect(equalPoints(p, q)).toBe(false);
        p = new Point(-1.11556, -5.1156);
        q = new Point(-1.1156, -5.1157);
        expect(equalPoints(p, q)).toBe(false);

    });
})
