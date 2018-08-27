import { Vector } from './Vector';
import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';


class Point {
    constructor(x, y, id, context, center, width, height) {
        this.mass = Math.floor(Math.random() * (16 - 2) + 2);
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.lastPos = null;
        this.accel = new Vector(0.001, 0.001);
        this.id = id;
        if (context) {
            this.width = width;
            this.height = height;
            this.nearest = null;
            this.speed = MIN_SPEED;
            this.center = new Point(center.x, center.y);
            this.rotation = this.angleInRadiansFrom(center);
            this.context = context;
            this.nextRot = this.rotation;
        }
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
}


export { Point };
