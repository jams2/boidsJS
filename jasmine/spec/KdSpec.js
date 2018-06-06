describe('Test nearest neighbour query', function() {
    var tree;
    var p = new Point(8, 9);
    beforeEach(function() {
        tree = new KdTree();
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
});

describe('Test insert method', function() {
    var tree;
    beforeEach(function() {
        tree = new KdTree();
    });
    afterEach(function() {
    });
    tree = null;
    it('Should have the correct quantity in count after no insertions', function() {
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
        for (var i = 0; i < 1000; i++) {
            tree.insert(new Point(Math.random, Math.random));
        }
        expect(tree.size).toBe(1000);
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
describe('Test constructor', function() {
    var tree;
    beforeEach(function() {
        tree = new KdTree();
    });
    it('Should have an undefined root after construction', function() {
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
