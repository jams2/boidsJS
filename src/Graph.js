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
            this.vertices[i].neighbours.forEach((neighbour) => {
                const indexOfNeighbour = this.vertices.indexOf(neighbour);
                this.adjacentVertexIndices[i].push(indexOfNeighbour);
                this.countEdges += 1;
            });
        }
    }
}


export default Graph;
