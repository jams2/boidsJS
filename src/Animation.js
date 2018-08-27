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

    gaussianRandomPoint() {
        return this.newPoint(Animation.gaussianRandom(this.width),
                             Animation.gaussianRandom(this.height));
    }

    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }

    // gaussian random generator from https://stackoverflow.com/a/39187274
    static gaussianRand() {
        var rand = 0;
        for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
        return rand / 6;
    }

    uniformRandomPoint() {
        return this.newPoint(Animation.uniformRandom(this.width),
                             Animation.uniformRandom(this.height));
    }

    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }

    animate() {
        this.analyser.update();
        const tree = new KdTree();
        const neighbourDrawn = [];
        this.points.forEach(function(point){
            tree.insert(point);
        });
        this.point_ctx.clearRect(0, 0, this.width, this.height);
        this.line_ctx.clearRect(0, 0, this.width, this.height);
        this.points.forEach(point=>{
            point.nearest = tree.nearestNeighbour(point);
            const freqScalar = this.analyser.freqData[point.mass * 8];
            this.drawPoint(point, this.point_ctx, freqScalar);
            if (document.querySelector('#neighbour-opt').checked &&
                    neighbourDrawn[point.id] === undefined) {
                this.drawLine(point.nearest, point, this.line_ctx, freqScalar);
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
            const centerGrav = point.getCenterGrav(this.center);
            point.applyForce(centerGrav);
            point.applyForce(point.getResistance());
            const dir = point.position.copy();
            const mag = dir.length();
            dir.normalize();
            if (freqScalar) {
                const scaled = freqScalar / 50;
                const antiGrav = centerGrav.copy();
                antiGrav.normalize();
                antiGrav.scale(freqScalar);
                antiGrav.scale(Math.round(Math.random()) || -1);
                point.applyForce(antiGrav);
            }
            point.move();
        });
        if (this.doAnim) {
           window.requestAnimationFrame(()=> this.animate());
        }
    }

    drawPoint(point, context, intensity) {
        context.fillStyle = `rgb(${(intensity - 1) * 10}, 50, 50)`;
        context.beginPath();
        context.arc(point.position.x, point.position.y, point.mass, 0, 2*Math.PI, true);
        context.fill();
    }

    drawLine(b1, b2, context, intensity) {
        context.strokeStyle = `rgb(${(intensity - 1) * 7}, 50, 50)`;
        context.beginPath();
        context.moveTo(b1.position.x, b1.position.y);
        context.lineTo(b2.position.x, b2.position.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
}


export { Animation };
