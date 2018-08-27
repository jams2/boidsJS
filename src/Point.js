import { Vector } from './Vector';
import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';


class Point {
    constructor(x, y, id) {
        this.mass = Math.floor(Math.random() * (16 - 2) + 2);
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.lastPos = null;
        this.accel = new Vector(0.001, 0.001);
        this.id = id;
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

    move() {
        this.velocity.add(this.accel);
        this.velocity.limit(15);
        this.position.add(this.velocity);
        this.accel.scale(0);
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
        if (!range.avg || !range.mass) return new Vector(1, 1);
        const avgPos = range.avg;
        const totalMass = range.mass / 5;
        const pos = this.position;
        const dir = Vector.subtract(avgPos, pos);
        const mag = dir.length();
        dir.normalize();
        const grav = (0.001 * point.mass * totalMass) / (mag * mag);
        dir.scale(grav);
        return dir;
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

    getRangeAverages(tree) {
        const rect = new Rect(
            this.position.x - PROXIMITY, this.position.y - PROXIMITY,
            this.position.x + PROXIMITY, this.position.y + PROXIMITY
        )
        const neighbours = tree.range(rect);
        if (neighbours.length < 2) {
            return new Vector(1, 1);
        }
        const mass = neighbours.map(x => x.mass);
        const totalMass = mass.reduce((a, b) => a + b);
        const vectors = neighbours.map(x=>x.position);
        const sumVectors = vectors.reduce((acc, next) => {
            return Vector.add(acc, next);
        }, new Vector(0, 0));
        const avgPos = Vector.divide(sumVectors, neighbours.length);
        return { avg: avgPos, mass: totalMass };
    }
}


export { Point };
