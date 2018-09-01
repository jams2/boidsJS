import { Vector } from './Vector';
import { Rect } from './Rect';
import {
    FLOCK_POSITION_SCALAR, MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C,
    COLLISION, FLOCK_VELOCITY_SCALAR
} from './constants';


class Point {
    constructor(x, y, id) {
        this.mass = 3;
        this.position = new Vector(x, y);
        this.velocity = new Vector(Math.floor(Math.random() * 6), Math.floor(Math.random() * 6));
        this.lastPos = null;
        this.accel = new Vector(0.0001, 0.0001);
        this.id = id;
    }

    distToNearest() {
        const dir = Vector.subtract(this.position, this.nearest.position);
        const length = dir.length();
        return length;
    }

    applyForce(force) {
        Vector.checkArgType(force);
        const f = Vector.divide(force, this.mass);
        this.accel.add(f);
    }

    angleInRadiansFrom(that) {
        return Math.atan2(
            this.position.y - that.position.y,
            this.position.x - that.position.x
        );
    }

    avoidCollision() {
        if (this.distToNearest() < COLLISION) {
            const delta = Vector.subtract(
                new Vector(0, 0),
                Vector.subtract(
                    this.nearest.position, this.position
                )
            );
            this.applyForce(delta);
        }
    }

    tendTowards(position, scalar) {
        const towards = Vector.subtract(position, this.position);
        towards.divideBy(100);
        towards.scale(scalar);
        return towards;
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
        else return 0;
    }

    slopeTo(that) {
        if (this.position.x == that.position.x &&
            this.position.y == that.position.y)
            return -Infinity;
        else if (this.position.y == that.position.y) return 0.0;
        else if (this.position.x == that.position.x) return Infinity;
        else return (that.position.y - this.position.y) /
            (that.position.x - this.position.x);
    }

    getFlockVector(range) {
        if (!range.avgPos || !range.avgVel) {
            return new Vector(0, 0)
        }
        range.avgPos.divideBy(100);
        range.avgPos.scale(FLOCK_POSITION_SCALAR);
        range.avgVel.divideBy(100);
        return range.avg;
    }

    getCenterGrav(centerPoint) {
        const dir = Vector.subtract(centerPoint.position, this.position);
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
            this.position.x + PROXIMITY, this.position.y + PROXIMITY
        )
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
        dir.normalize;
        dir.scale(0.5);
        return dir;
    }

    getVectorMean(vectors, property) {
        const len = vectors.length;
        const sumVectors = new Vector(0, 0);
        for (let i = 0; i < len; i++) {
            if (vectors[i].id === this.id) {
                continue;
            }
            sumVectors.add(vectors[i][property]);
        }
        sumVectors.divideBy(len - 1);
        return sumVectors;
    }
}


export { Point };
