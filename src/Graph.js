const CONNECTION_THRESHOLD = 12;


class Graph {
    constructor(particles) {
        this.vertices = particles.slice(0);
        this.countEdges = 0;
        this.adjacentVertexIndices = Array(this.countVertices).map(() => []);
        for (let i = 0; i < this.vertices.length; i += 1) {
            if (particles[i].distToNearest() <= CONNECTION_THRESHOLD) {
                const indexOfNearest = this.vertices.indexOf(particles[i].nearest);
                this.adjacentVertexIndices[i].push(indexOfNearest);
                this.countEdges += 1;
            }
        }
    }
}


export default Graph;
