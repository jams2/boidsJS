describe("Test boundary cases", function() {
    it('Should return null if querying nearest neighbour of the only inserted point', function(){
        let tree = new KdTree();
        let p = new Point(8, 9);
        expect(tree.nearestNeighbour(p)).toBe(null);
    });
});
