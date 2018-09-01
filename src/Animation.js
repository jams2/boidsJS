import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';
import { Point } from './Point';
import { Node, KdTree, equalPoints, compareDouble, distanceSquared } from './KdTree';
import { Vector } from './Vector';
import { Rect } from './Rect';


class Animation {
    constructor(container0, container1) {
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
        const tree = new KdTree();
        const neighbourDrawn = [];
        this.points.forEach(function(point){
            tree.insert(point);
        });
        this.point_ctx.clearRect(0, 0, this.width, this.height);
        this.line_ctx.clearRect(0, 0, this.width, this.height);

        // main anim loop
        this.points.forEach(point=>{
            point.nearest = tree.nearestNeighbour(point);
            this.drawPoint(point, this.point_ctx, 50);
            if (document.querySelector('#neighbour-opt').checked &&
                    neighbourDrawn[point.id] === undefined) {
                this.drawLine(point.nearest, point, this.line_ctx, 50);
                neighbourDrawn[point.id] = true;
            }
            const neighbours = point.getNeighbours(tree);
            if (neighbours !== null && point !== undefined) {
                const avgPosition = point.getAvgPosition(neighbours);
                point.applyForce(avgPosition);
                //const avgVelocity = point.getAvgVelocity(neighbours);
                //point.applyForce(avgVelocity);
            }
            point.avoidCollision();
            point.applyForce(point.getResistance());
            this.getBoundaryReflection(point);
            point.move();
        });
        if (this.doAnim) {
           window.requestAnimationFrame(()=> this.animate());
        }
    }

    getNeighbouringPoints(point, tree) {
        const pos = point.position;
        const rect = new Rect(
            pos.x - PROXIMITY, pos.y - PROXIMITY,
            pos.x + PROXIMITY, pos.y + PROXIMITY
        )
        const neighbours = tree.range(rect);
        return neighbours;
    }

    getBoundaryReflection(point) {
        const pos = point.position;
        let edge1 = null;
        let edge2 = null;
        if (pos.x < 0) {
            pos.x = this.width;
            //pos.y = this.height - pos.y;
        }
        else if (pos.x > this.width) {
            pos.x = 0;
            //pos.y = this.height - pos.y;
        }
        if (pos.y < 0) {
            pos.y = this.height;
            //pos.x = this.width - pos.x;
        }
        else if (pos.y > this.height) {
            pos.y = 0;
            //pos.x = this.width - pos.x;
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
