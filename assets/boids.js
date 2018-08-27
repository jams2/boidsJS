'use strict';

import { KdTree, equalPoints, compareDouble, distanceSquared } from './KdTree'; 
const MAX_SPEED = 1.5;
const MIN_SPEED = 1;
const ACCEL = 1.001;
const DECEL = Math.PI / MAX_SPEED;
const ROTATION_RATE = 0.4;
const START_COUNT = 100;
const FULL_ROT = 2 * Math.PI;
const PROXIMITY = 2;
const G = 43;
const C = 0.000001;



class AudioSource {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        navigator.mediaDevices.getUserMedia(
            {audio: true, video: false}
        ).then(stream => {
            this.source = this.ctx.createMediaStreamSource(stream)
        }).then(()=> this.source.connect(this.analyser));
        this.analyser.fftSize = 256;
        this.analyser.maxDecibels = 50;
        this.analyser.minDecibels = -70;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.freqData = new Uint8Array(this.bufferLength);
    }

    update() {
        this.analyser.getByteFrequencyData(this.freqData);
    }
}


class Node {
    constructor(point, _parent) {
        this.point = [point];
        this._parent = _parent;
        this.lb = null;
        this.rt = null;
    }
}



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


window.addEventListener("load", function() {
    const container0 = document.querySelector('#container0');
    const container1 = document.querySelector('#container1');
    const analyser = new AudioSource();
    const anim = new Animation(container0, container1, analyser);
    anim.animate();
});
