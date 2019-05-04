import {
    START_COUNT,
    PROXIMITY,
} from './constants';
import { Particle } from './Particle';
import { KdTree } from './KdTree';
import { Rect } from './Rect';


class Animation {
    constructor(particleContextContainer, lineContextContainer) {
        this.fpsDisplay = document.querySelector('#fps');
        this.canvasWidth = particleContextContainer.clientWidth;
        this.canvasHeight = particleContextContainer.clientHeight;
        const particleCanvas = this.createCanvas('particle-canvas');
        const lineCanvas = this.createCanvas('line-canvas');
        particleContextContainer.appendChild(particleCanvas);
        lineContextContainer.appendChild(lineCanvas);
        this.particleContext = particleCanvas.getContext('2d');
        this.particleContext.fillStyle = 'rgb(200, 255, 255)';
        this.particles = [];
        this.generateParticles(START_COUNT, Animation.gaussianRandomParticle);
        this.doAnim = true;
        this.times = [];
        this.fps = 0;
        document.querySelector('#stop').addEventListener('click', (event) => {
            event.preventDefault();
            this.doAnim = !this.doAnim;
            if (this.doAnim) this.animate();
        });
    }

    createCanvas(id) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        return canvas
    }

    generateParticles(count, particleFactory) {
        for (let _ = 0; _ < count; _ += 1) {
            this.particles.push(
                particleFactory(this.canvasWidth, this.canvasHeight, this.particles.length),
            );
        }
    }

    static gaussianRandomParticle(containerWidth, containerHeight, particleId) {
        return new Particle(
            Animation.gaussianRandom(containerWidth),
            Animation.gaussianRandom(containerHeight),
            particleId,
        );
    }

    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }

    // gaussian random generator from https://stackoverflow.com/a/39187274
    static gaussianRand() {
        let rand = 0;
        for (let i = 0; i < 6; i += 1) { rand += Math.random(); }
        return rand / 6;
    }

    static uniformRandomParticle(width, height, particleId) {
        return new Particle(
            Animation.uniformRandom(width),
            Animation.uniformRandom(height),
            particleId,
        );
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
        this.particles.forEach((particle) => {
            particle.nearest = null;
            tree.insert(particle);
        });

        // clear the canvas
        this.particleContext.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.particleContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        // this.particleContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // main anim loop
        this.particleContext.fillStyle = 'rgb(255, 50, 50)';
        this.particleContext.beginPath();
        this.particles.forEach((particle) => {
            if (particle.nearest === null) {
                particle.nearest = tree.nearestNeighbour(particle);
                particle.nearest.nearest = particle;
            }
            Animation.drawParticle(particle, this.particleContext, 50);
            const neighbours = particle.getNeighbours(tree);
            if (neighbours !== null && particle !== undefined) {
                const avgPosition = particle.getAvgPosition(neighbours);
                particle.applyForce(avgPosition);
                const avgVelocity = particle.getAvgVelocity(neighbours);
                particle.applyForce(avgVelocity);
            }
            particle.avoidCollision();
            particle.collide();
            particle.applyForce(particle.getResistance());
            this.getBoundaryReflection(particle);
            particle.move();
        });
        this.particleContext.fill();
        if (this.doAnim) {
            window.requestAnimationFrame(() => this.animate());
        }
    }

    static getNeighbouringParticles(particle, tree) {
        const pos = particle.position;
        const rect = new Rect(
            pos.x - PROXIMITY, pos.y - PROXIMITY,
            pos.x + PROXIMITY, pos.y + PROXIMITY,
        );
        const neighbours = tree.range(rect);
        return neighbours;
    }

    getBoundaryReflection(particle) {
        const pos = particle.position;
        if (pos.x < 0) {
            pos.x = this.canvasWidth;
        } else if (pos.x > this.canvasWidth) {
            pos.x = 0;
        }
        if (pos.y < 0) {
            pos.y = this.canvasHeight;
        } else if (pos.y > this.canvasHeight) {
            pos.y = 0;
        }
    }

    static drawParticle(particle, context) {
        context.moveTo(particle.position.x, particle.position.y);
        context.arc(particle.position.x, particle.position.y, particle.mass, 0, 2*Math.PI, true);
    }

    static drawLine(b1, b2, context) {
        context.strokeStyle = 'rgb(255, 50, 50)';
        context.beginPath();
        context.moveTo(b1.position.x, b1.position.y);
        context.lineTo(b2.position.x, b2.position.y);
        context.stroke();
        context.strokeStyle = 'rgb(200, 255, 255)';
    }
}


export default Animation;
