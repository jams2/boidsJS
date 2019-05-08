import { Vector } from './Vector';
import { Rect } from './Rect';


class Wind {
    constructor(x, y, xmin, ymin, xmax, ymax) {
        this.force = new Vector(x, y);
        this.remainingFrames = 60;
        if (xmin > xmax) {
            const tmp = xmin;
            xmin = xmax;
            xmax = tmp;
        }
        if (ymin > ymax) {
            const tmp = ymin;
            ymin = ymax;
            ymax = tmp;
        }
        this.area = new Rect(xmin, ymin, xmax, ymax);
    }
}


export { Wind };
