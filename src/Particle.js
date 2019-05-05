import { Vector } from './Vector';
import { Rect } from './Rect';
import {
    FLOCK_POSITION_SCALAR,
    MAX_SPEED,
    PROXIMITY,
    G,
    C,
    COLLISION,
    MOUSE_REPEL,
} from './constants';


class Particle {
    constructor(x, y, id) {
        this.mass = 3;
        this.position = new Vector(x, y);
        this.velocity = new Vector(
            Math.floor(Math.random() * MAX_SPEED),
            Math.floor(Math.random() * MAX_SPEED),
        );
        this.lastPos = null;
        this.accel = new Vector(0.0001, 0.0001);
        this.id = id;
        this.nearest = null;
    }

    getNearestNeighbour(tree) {
        return tree.nearestNeighbour(this);
    }

    setNearestNeighbour(otherParticle) {
        this.nearest = otherParticle;
    }

    alignWithNeighbours(neighbours) {
        this.applyAvgPosition(neighbours);
        this.applyAvgVelocity(neighbours);
    }

    applyAvgPosition(neighbours) {
        const avgPosition = this.getAvgPosition(neighbours);
        this.applyForce(avgPosition);
    }

    applyAvgVelocity(neighbours) {
        const avgVelocity = this.getAvgVelocity(neighbours);
        this.applyForce(avgVelocity);
    }

    distToNearest() {
        const dir = Vector.subtract(this.position, this.nearest.position);
        const length = dir.length();
        return length;
    }

    distSquaredTo(other) {
        const dir = Vector.subtract(this.position, other.position);
        return dir.lengthSq();
    }

    applyForce(force) {
        Vector.checkArgType(force);
        const f = Vector.divide(force, this.mass);
        this.accel.add(f);
    }

    angleInRadiansFrom(that) {
        return Math.atan2(
            this.position.y - that.position.y,
            this.position.x - that.position.x,
        );
    }

    performCollision() {
        if (this.nearest !== null && this.distSquaredTo(this.nearest) <= 20) {
            const tmp = this.nearest.velocity;
            this.nearest.velocity = this.velocity;
            this.velocity = tmp;
        }
    }

    avoidCollision() {
        if (this.distToNearest() < COLLISION) {
            const delta = Vector.subtract(
                new Vector(0, 0),
                Vector.subtract(this.nearest.position, this.position),
            );
            delta.scale(0.75);
            this.applyForce(delta);
        }
    }

    tendTowards(position, scalar) {
        const towards = Vector.subtract(position, this.position);
        towards.divideBy(100);
        towards.scale(scalar);
        return towards;
    }

    attractTo(position) {
        const dir = Vector.subtract(position, this.position);
        dir.normalize();
        dir.scale(MOUSE_REPEL);
        this.applyForce(dir);
    }

    move() {
        this.velocity.add(this.accel);
        this.velocity.limit(MAX_SPEED);
        this.position.add(this.velocity);
        this.accel.scale(0);
        this.position.x = Math.floor(this.position.x);
        this.position.y = Math.floor(this.position.y);
    }

    getDx() {
        return this.speed * Math.cos(this.rotation);
    }

    getDy() {
        return this.speed * Math.sin(this.rotation);
    }

    bySlope(p, q) {
        return this.slopeTo(p) - this.slopeTo(q);
    }

    compareTo(that) {
        if (this.position.y < that.position.y) return -1;
        else if (this.position.y > that.position.y) return 1;
        else if (this.position.x < that.position.x) return -1;
        else if (this.position.x > that.position.x) return 1;
        return 0;
    }

    slopeTo(that) {
        if (this.positionEquals(that)) return -Infinity;
        else if (this.position.y === that.position.y) return 0.0;
        else if (this.position.x === that.position.x) return Infinity;
        return (that.position.y - this.position.y) / (that.position.x - this.position.x);
    }

    positionEquals(that) {
        return this.position.x === that.position.x && this.position.y === that.position.y;
    }

    getFlockVector(range) {
        if (!range.avgPos || !range.avgVel) {
            return new Vector(0, 0);
        }
        range.avgPos.divideBy(100);
        range.avgPos.scale(FLOCK_POSITION_SCALAR);
        range.avgVel.divideBy(100);
        return range.avg;
    }

    getCenterGrav(centerParticle) {
        const dir = Vector.subtract(centerParticle.position, this.position);
        const mag = dir.length();
        dir.normalize();
        const grav = (G * this.mass * 26) / (mag * mag);
        dir.scale(grav);
        return dir;
    }

    getResistance() {
        const speed = this.velocity.length();
        // get half circumference of circle for frontal area - mass is radius
        const frontalArea = Math.PI * this.mass;
        const dragMagnitude = frontalArea * C * speed * speed;
        const drag = this.velocity.copy();
        drag.normalize();
        drag.scale(-1);
        drag.scale(dragMagnitude);
        return drag;
    }

    getNeighbourGrav() {
        const pos = this.position;
        const neighbour = this.nearest.position;
        const dir = Vector.subtract(neighbour, pos);
        const dist = dir.length();
        const m = (G * this.mass * this.nearest.mass) / (dist * dist);
        dir.normalize();
        dir.scale(m);
        return dir;
    }

    getNeighbours(tree) {
        const rect = new Rect(
            this.position.x - PROXIMITY, this.position.y - PROXIMITY,
            this.position.x + PROXIMITY, this.position.y + PROXIMITY,
        );
        const neighbours = tree.range(rect);
        if (neighbours.length < 2) {
            return null;
        }
        return neighbours;
    }

    getAvgPosition(neighbours) {
        const avgPosition = this.getVectorMean(neighbours, 'position');
        const dir = Vector.subtract(avgPosition, this.position);
        dir.normalize();
        dir.scale(0.5);
        return dir;
    }

    getAvgVelocity(neighbours) {
        const avgVelocity = this.getVectorMean(neighbours, 'velocity');
        const dir = Vector.subtract(avgVelocity, this.velocity);
        dir.scale(0.5);
        return dir;
    }

    getVectorMean(vectors, property) {
        const len = vectors.length;
        const sumVectors = new Vector(0, 0);
        for (let i = 0; i < len; i += 1) {
            if (vectors[i].id === this.id) {
                continue;
            }
            sumVectors.add(vectors[i][property]);
        }
        sumVectors.divideBy(len - 1);
        return sumVectors;
    }
}


export default Particle;
