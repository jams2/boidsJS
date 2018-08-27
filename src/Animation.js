import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';
import { Point } from './Point';
import { Node, KdTree, equalPoints, compareDouble, distanceSquared } from './KdTree'; 
import { Vector } from './Vector';


class Animation {
    constructor(container0, container1, audio) {
        this.analyser = audio;
        this.points = [];
        this.width = document.querySelector('.container0').clientWidth;
        this.height = document.querySelector('.container0').clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.center = this.newPoint(this.center.x, this.center.y);
        this.centerOfMass = this.newPoint(this.center.x, this.center.y);
        container0.innerHTML = `<canvas id="point_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        container1.innerHTML = `<canvas id="line_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        this.canvas0 = document.querySelector('#point_ctx');
        this.canvas1 = document.querySelector('#line_ctx');
        this.line_ctx = this.canvas0.getContext('2d');
        this.point_ctx = this.canvas1.getContext('2d');
        this.point_ctx.fillStyle = 'rgb(200, 255, 255)';
        this.generatePoints(START_COUNT, this.gaussianRandomPoint);
        this.canvas1.addEventListener('click', (elt)=> this.pointFromClick(elt));
        this.doAnim = true;
        document.querySelector('#stop').addEventListener('click', ()=> {
            this.doAnim = !this.doAnim;
            if (this.doAnim) this.animate();
        });
    }

    newPoint(x, y) {
        return new Point(x, y, this.points.length, this.point_ctx, this.center, this.width, this.height);
    }

    pointFromClick(elt) {
        this.points.push(this.newPoint(elt.clientX, elt.clientY));
    }

    generatePoints(x, func) {
        let pointFactory = func.bind(this);
        for (var _ = 0; _ < x; _++) {
            this.points.push(pointFactory());
        }
    }

    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }

    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }

    gaussianRandomPoint() {
        return this.newPoint(Animation.gaussianRandom(this.width),
                             Animation.gaussianRandom(this.height));
    }

    uniformRandomPoint() {
        return this.newPoint(Animation.uniformRandom(this.width),
                             Animation.uniformRandom(this.height));
    }

    // gaussian random generator from https://stackoverflow.com/a/39187274
    static gaussianRand() {
        var rand = 0;
        for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
        return rand / 6;
    }

    animate() {
        this.analyser.update();
        let tree = new KdTree();
        let neighbourDrawn = [];
        this.points.forEach(function(point){
            tree.insert(point);
        });
        this.point_ctx.clearRect(0, 0, this.width, this.height);
        this.line_ctx.clearRect(0, 0, this.width, this.height);
        this.points.forEach(point=>{
            point.nearest = tree.nearestNeighbour(point);
            this.drawPoint(point, this.point_ctx);
            if (document.querySelector('#neighbour-opt').checked &&
                    neighbourDrawn[point.id] === undefined) {
                this.drawLine(point.nearest, point, this.line_ctx);
                neighbourDrawn[point.id] = true;
            }
            const pos = point.position;
            if (pos.x < 0) {
                const edge1 = Vector.subtract(new Vector(0, pos.y), pos);
                const mag = edge1.length();
                edge1.normalize();
                edge1.scale(mag);
                point.applyForce(edge1);
            }
            else if (pos.x > this.width) {
                const edge1 = Vector.subtract(new Vector(this.width, pos.y), pos);
                const mag = edge1.length();
                edge1.normalize();
                edge1.scale(mag);
                point.applyForce(edge1);
            }
            if (pos.y < 0) {
                const edge2 = Vector.subtract(new Vector(pos.x, 0), pos);
                const mag = edge2.length();
                edge2.normalize();
                edge2.scale(mag);
                point.applyForce(edge2);
            }
            else if (pos.y > this.height) {
                const edge2 = Vector.subtract(new Vector(pos.x, this.height), pos);
                const mag = edge2.length();
                edge2.normalize();
                edge2.scale(mag);
                point.applyForce(edge2);
            }
            const centerGrav = this.getCenterGrav(point);
            const dir = point.position.copy();
            const mag = dir.length();
            dir.normalize();
            const freqScalar = this.analyser.freqData[point.mass*8];
            if (freqScalar) {
                const scaled = freqScalar / 50;
                const antiGrav = centerGrav.copy();
                antiGrav.normalize();
                antiGrav.scale(freqScalar);
                antiGrav.scale(Math.round(Math.random()) || -1);
                point.applyForce(antiGrav);
            }
            point.applyForce(centerGrav);
            point.move();
        });
        if (this.doAnim) {
           window.requestAnimationFrame(()=> this.animate());
        }
    }

    getFlockVector(point, range) {
        if (!range.avg || !range.mass) return new Vector(1, 1);
        const avgPos = range.avg;
        const totalMass = range.mass / 5;
        const pos = point.position;
        const dir = Vector.subtract(avgPos, pos);
        const mag = dir.length();
        dir.normalize();
        const grav = (0.001 * point.mass * totalMass) / (mag * mag);
        dir.scale(grav);
        return dir;
    }

    getCenterGrav(point) {
        const dir = Vector.subtract(this.center.position, point.position);
        const mag = dir.length();
        dir.normalize();
        const grav = (G * point.mass * 26) / (mag * mag);
        dir.scale(grav);
        return dir;
    }

    getResistance(point) {
        const speed = point.velocity.length();
        // get half circumference of circle for frontal area - mass is radius
        const frontalArea = Math.PI * point.mass;
        const dragMagnitude = frontalArea * C * speed * speed;
        const drag = point.velocity.copy();
        drag.normalize();
        drag.scale(-1);
        drag.scale(dragMagnitude);
        return drag;
    }

    getNeighbourGrav(point) {
        const pos = point.position;
        const neighbour = point.nearest.position;
        const dir = Vector.subtract(neighbour, pos);
        const dist = dir.length();
        const m = (G * point.mass * point.nearest.mass) / (dist * dist);
        dir.normalize();
        dir.scale(m);
        return dir;
    }

    edgeGrav(point) {
        const north = Vector.subtract(point.position, new Vector(point.position.x, 0));
        const dNorth = north.length()
        const fNorth = (G * point.mass * 20) / dNorth * dNorth;
        north.normalize();
        north.scale(fNorth);
        const east = Vector.subtract(point.position, new Vector(this.width, point.position.y));
        const dEast = east.length()
        const fEast = (G * point.mass * 20) / dEast * dEast;
        east.normalize();
        east.scale(fEast);
        const south = Vector.subtract(point.position, new Vector(point.position.x, this.height));
        const dSouth = south.length()
        const fSouth = (G * point.mass * 20) / dSouth * dSouth;
        south.normalize();
        south.scale(fSouth);
        const west = Vector.subtract(point.position, new Vector(0, point.position.y));
        const dWest = west.length()
        const fWest = (G * point.mass * 20) / dWest * dWest;
        west.normalize();
        west.scale(fWest);
        const min = Math.min(dNorth, dEast, dSouth, dWest);
        let selected = null;
        switch (min) {
            case dNorth:
                selected = north;
                break;
            case dEast:
                selected = east;
                break;
            case dSouth:
                selected = south;
                break;
            case dWest:
                selected = west;
                break;
        }
        selected.scale(-1);
        return selected;
    }

    drawPoint(point, context) {
        context.beginPath();
        context.arc(point.position.x, point.position.y, point.mass, 0, 2*Math.PI, true);
        context.fill();
    }

    drawLine(b1, b2, context) {
        context.strokeStyle = 'rgb(100, 155, 155)';
        context.beginPath();
        context.moveTo(b1.position.x, b1.position.y);
        context.lineTo(b2.position.x, b2.position.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
 
    getRangeAverages(p, tree) {
        const rect = new Rect(
            p.position.x - PROXIMITY, p.position.y - PROXIMITY,
            p.position.x + PROXIMITY, p.position.y + PROXIMITY
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

    drawCenterOfMass(context, point) {
        context.fillStyle = 'rgb(200, 255, 200)';
        context.beginPath();
        context.arc(point.position.x, point.position.y, 10, 0, 2*Math.PI, true);
        context.fill();
        context.fillStyle = 'rgb(200, 255, 255)';
    }
}


export { Animation };
