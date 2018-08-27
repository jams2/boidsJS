class Rect {
    constructor(xmin, ymin, xmax, ymax) {
        if (xmin === undefined || xmin === null || ymin === undefined || ymin === null ||
            xmax === undefined || xmax === null || ymax === undefined || ymax === null) {
            throw 'Invalid argument';
        }
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
    }

    contains(point) {
        return point.position.x >= this.xmin && point.position.x <= this.xmax &&
            point.position.y >= this.ymin && point.position.y <= this.ymax;
    }
}

export { Rect };
