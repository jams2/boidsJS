const CONNECTION_THRESHOLD = 150;


class Graph {
    constructor(particles) {
        this.vertices = particles.slice(0);
        this.adjacentVertexIndices = [];
        for (let i = 0; i < this.vertices.length; i += 1) {
            this.adjacentVertexIndices[i] = [];
        }
        this.countEdges = 0;
        for (let i = 0; i < this.vertices.length; i += 1) {
            if (this.vertices[i].distToNearest() <= CONNECTION_THRESHOLD) {
                const indexOfNearest = this.vertices.indexOf(this.vertices[i].nearest);
                this.adjacentVertexIndices[i].push(indexOfNearest);
                this.countEdges += 1;
            }
        }
    }
}


export default Graph;
