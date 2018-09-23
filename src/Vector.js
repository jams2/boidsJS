class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static checkArgType(other) {
        if (!(other instanceof Vector)) {
            throw 'Invalid arg';
        }
    }

    limit(max) {
        if (this.length() > max) {
            this.normalize();
            this.scale(max);
        }
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    static add(v1, v2) {
        return new Vector(
            v1.x + v2.x,
            v1.y + v2.y
        );
    }

    static subtract(v1, v2) {
        return new Vector(
            v1.x - v2.x, v1.y - v2.y
        );
    }

    static divide(vector, scalar) {
        return new Vector(vector.x / scalar, vector.y / scalar);
    }

    add(other) {
        Vector.checkArgType(other);
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other) {
        Vector.checkArgType(other);
        this.x -= other.x;
        this.y -= other.y;
    }

    scale(scalar) {
        if (isNaN(scalar)) {
            throw 'Invalid argument';
        }
        this.x *= scalar;
        this.y *= scalar;
    }

    divideBy(scalar) {
        if (isNaN(scalar)) {
            throw 'Invalid argument';
        }
        this.x /= scalar;
        this.y /= scalar;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        const m = this.length();
        if (m) {
            this.divideBy(m);
        }
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}


export { Vector };
