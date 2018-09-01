import { Vector } from './Vector';
import { Rect } from './Rect';
import {
    FLOCK_POSITION_SCALAR, MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C,
    COLLISION, FLOCK_VELOCITY_SCALAR
} from './constants';


class Point {
    constructor(x, y, id) {
        this.mass = Math.floor(4);
        this.position = new Vector(x, y);
        this.velocity = new Vector(2, 2);
        this.lastPos = null;
        this.accel = new Vector(0.001, 0.001);
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
                    this.position, this.nearest.position
                )
            );
            this.applyForce(delta);
        }
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
        const vectors = neighbours.map(x => x.position);
        const avgPosition = this.getVectorMean(vectors);
        avgPosition.scale(FLOCK_POSITION_SCALAR);
        return avgPosition;
    }

    getAvgVelocity(neighbours) {
        const vectors = neighbours.map(x => x.velocity);
        const avgVelocity = this.getVectorMean(vectors);
        avgVelocity.scale(FLOCK_VELOCITY_SCALAR);
        return avgVelocity;
    }

    getVectorMean(vectors) {
        const sumVectors = vectors.reduce((acc, next) => {
            if (next.x === this.x && next.y === this.y) {
                return acc;
            }
            return Vector.add(acc, next);
        }, new Vector(0, 0));
        const avg = Vector.divide(sumVectors, vectors.length - 1);
        return avg;
    }
}


export { Point };
