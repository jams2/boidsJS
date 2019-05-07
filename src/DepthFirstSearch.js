class DepthFirstSearch {
    constructor(graph) {
        this.marked = Array(graph.length).fill(false);
        this.componentId = Array(graph.length).fill(null);
        this.componentSize = Array(graph.length).fill(0);
        this.numComponents = 0;
        for (let vertexIndex = 0; vertexIndex < graph.vertices.length; vertexIndex += 1) {
            if (!this.marked[vertexIndex]) {
                this.depthFirstSearch(graph, vertexIndex);
                this.numComponents += 1;
            }
        }
    }

    depthFirstSearch(graph, vertexIndex) {
        this.marked[vertexIndex] = true;
        this.componentId[vertexIndex] = this.numComponents;
        this.componentSize[this.numComponents] += 1;
        graph.adjacentVertexIndices[vertexIndex].forEach((adjacentVertexIndex) => {
            if (!this.marked[adjacentVertexIndex]) {
                this.depthFirstSearch(graph, adjacentVertexIndex);
                this.numComponents += 1;
            }
        });
    }
}


export default DepthFirstSearch;
