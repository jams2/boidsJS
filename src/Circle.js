import { Rect } from './Rect';

class Circle {
    constructor(x, y, radius) {
        this.centerX = x;
        this.centerY = y;
        this.radius = radius;
        this.xmin = this.centerX - this.radius;
        this.ymin = this.centerY - this.radius;
        this.xmax = this.centerX + this.radius;
        this.ymax = this.centerY + this.radius;
        this.boundingRect = new Rect(this.xmin, this.ymin, this.xmax, this.ymax);
    }

    contains(point) {
        return (this.distSquaredFromCenter(point) <= this.radius * this.radius);
    }

    update(x, y) {
        this.centerX = x;
        this.centerY = y;
        this.xmin = this.centerX - this.radius;
        this.ymin = this.centerY - this.radius;
        this.xmax = this.centerX + this.radius;
        this.ymax = this.centerY + this.radius;
        this.boundingRect.xmin = this.xmin;
        this.boundingRect.ymin = this.ymin;
        this.boundingRect.xmax = this.xmax;
        this.boundingRect.ymax = this.ymax;
    }

    distSquaredFromCenter(point) {
        const pos = point.position;
        const dX = pos.x - this.centerX;
        const dY = pos.y - this.centerY;
        return dX*dX + dY*dY;
    }
}

export { Circle };
