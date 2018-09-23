import {
    MOUSE_RADIUS, MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C
} from './constants';
import { Particle } from './Particle';
import { Node, KdTree, equalParticles, comparePosition, distanceSquared } from './KdTree';
import { Vector } from './Vector';
import { Rect } from './Rect';
import { Circle } from './Circle';


class Animation {
    constructor(container0, container1) {
        this.fpsDisplay = document.querySelector('#fps');
        this.particles = [];
        this.width = document.querySelector('.container0').clientWidth;
        this.height = document.querySelector('.container0').clientHeight;
        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};
        this.center = this.newParticle(this.center.x, this.center.y);
        this.centerOfMass = this.newParticle(this.center.x, this.center.y);
        container0.innerHTML = `<canvas id="particle_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        container1.innerHTML = `<canvas id="line_ctx" width="${this.width}" height="${this.height}"></canvas>`;
        this.canvas0 = document.querySelector('#particle_ctx');
        this.canvas1 = document.querySelector('#line_ctx');
        this.line_ctx = this.canvas0.getContext('2d');
        this.particle_ctx = this.canvas1.getContext('2d');
        this.particle_ctx.fillStyle = 'rgb(200, 255, 255)';
        this.generateParticles(START_COUNT, this.gaussianRandomParticle);
        this.canvas1.addEventListener('click', (elt)=> this.ParticleFromClick(elt));
        this.doAnim = true;
        this.mouseX = null;
        this.mouseY = null;
        this.circle = null;
        this.times = [];
        this.fps = 0;
        document.querySelector('#stop').addEventListener('click', ()=> {
            this.doAnim = !this.doAnim;
            if (this.doAnim) this.animate();
        });
    }

    handleMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (this.circle === null || this.circle === undefined) {
            this.circle = new Circle(this.mouseX, this.mouseY, MOUSE_RADIUS);
        }
        else {
            this.circle.update(this.mouseX, this.mouseY);
        }
    }

    newParticle(x, y) {
        return new Particle(x, y, this.particles.length, this.particle_ctx, this.center, this.width, this.height);
    }

    ParticleFromClick(elt) {
        this.particles.push(this.newParticle(elt.clientX, elt.clientY));
    }

    generateParticles(x, func) {
        let particleFactory = func.bind(this);
        for (var _ = 0; _ < x; _++) {
            this.particles.push(particleFactory());
        }
    }

    gaussianRandomParticle() {
        return this.newParticle(Animation.gaussianRandom(this.width),
                             Animation.gaussianRandom(this.height));
    }

    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }

    // gaussian random generator from https://stackoverflow.com/a/39187274
    static gaussianRand() {
        var rand = 0;
        for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
        return rand / 6;
    }

    uniformRandomParticle() {
        return this.newParticle(Animation.uniformRandom(this.width),
                             Animation.uniformRandom(this.height));
    }

    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }

    updateFps(now) {
        // https://stackoverflow.com/a/48036361
        while (this.times.length > 0 && this.times[0] <= now - 1000) {
          this.times.shift();
        }
        this.times.push(now);
        this.fps = this.times.length;
        this.fpsDisplay.innerHTML = this.fps;
    }

    animate() {
        const now = performance.now();
        this.updateFps(now);
        const tree = new KdTree();
        this.particles.forEach(function(particle){
            tree.insert(particle);
        });

        // clear the canvas
        //this.particle_ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        //this.particle_ctx.fillRect(0, 0, this.width, this.height);
        this.particle_ctx.clearRect(0, 0, this.width, this.height);

        // main anim loop
        this.particle_ctx.fillStyle = 'rgb(255, 50, 50)';
        this.particle_ctx.beginPath();
        this.particles.forEach(particle=>{
            particle.nearest = tree.nearestNeighbour(particle);
            this.drawParticle(particle, this.particle_ctx, 50);
            const neighbours = particle.getNeighbours(tree);
            if (neighbours !== null && particle !== undefined) {
                const avgPosition = particle.getAvgPosition(neighbours);
                particle.applyForce(avgPosition);
                const avgVelocity = particle.getAvgVelocity(neighbours);
                particle.applyForce(avgVelocity);
            }
            //const wind = new Vector(0, -100);
            //const midX = this.width / 2;
            //const end = midX + 50;
            //const midY = this.height / 2;
            //if (particle.position.x >= midX && particle.position.x <= end) {
                //particle.applyForce(wind);
            //}
            particle.avoidCollision();
            particle.collide();
            particle.applyForce(particle.getResistance());
            this.getBoundaryReflection(particle);
            particle.move();
        });

        if (this.circle !== null) {
            const particlesNearMouse = tree.range(this.circle.boundingRect);
            if (particlesNearMouse) {
                const len = particlesNearMouse.length;
                const center = new Vector(this.mouseX, this.mouseY);
                for (let i = 0; i < len; i++) {
                    const particle = this.particles[i];
                    if (this.circle.contains(particle)) {
                        particle.attractTo(center);
                    }
                }
            }
        }
        this.particle_ctx.fill();
        if (this.doAnim) {
           window.requestAnimationFrame(()=> this.animate());
        }
    }

    getNeighbouringParticles(particle, tree) {
        const pos = particle.position;
        const rect = new Rect(
            pos.x - PROXIMITY, pos.y - PROXIMITY,
            pos.x + PROXIMITY, pos.y + PROXIMITY
        )
        const neighbours = tree.range(rect);
        return neighbours;
    }

    getBoundaryReflection(particle) {
        const pos = particle.position;
        if (pos.x < 0) {
            pos.x = this.width;
        }
        else if (pos.x > this.width) {
            pos.x = 0;
        }
        if (pos.y < 0) {
            pos.y = this.height;
        }
        else if (pos.y > this.height) {
            pos.y = 0;
        }
    }

    drawParticle(particle, context) {
        context.moveTo(particle.position.x, particle.position.y);
        context.arc(particle.position.x, particle.position.y, particle.mass, 0, 2*Math.PI, true);
    }

    drawLine(b1, b2, context) {
        context.strokeStyle = 'rgb(255, 50, 50)';
        context.beginPath();
        context.moveTo(b1.position.x, b1.position.y);
        context.lineTo(b2.position.x, b2.position.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + 1;
}


export { Animation };
