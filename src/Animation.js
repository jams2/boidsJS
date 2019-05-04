import {
    START_COUNT,
    PROXIMITY,
    PARTICLE_CONTEXT_FILLSTYLE,
} from './constants';
import { Particle } from './Particle';
import { KdTree } from './KdTree';
import { Rect } from './Rect';
import FPSDisplay from './FPSDisplay';


class Animation {
    constructor(particleContextContainer, lineContextContainer) {
        this.fpsDisplay = new FPSDisplay(document.querySelector('#fps'));
        this.canvasWidth = particleContextContainer.clientWidth;
        this.canvasHeight = particleContextContainer.clientHeight;
        this.particleContext = this.createAnimationContext(
            particleContextContainer,
            PARTICLE_CONTEXT_FILLSTYLE
        );
        this.lineContext = this.createAnimationContext(lineContextContainer);
        this.particles = this.generateParticles(START_COUNT, Animation.gaussianRandomParticle);
        this.doAnim = true;
        document.querySelector('#stop').addEventListener('click', (event) => {
            event.preventDefault();
            this.doAnim = !this.doAnim;
            if (this.doAnim) this.animate();
        });
    }

    createAnimationContext(container, fillStyle) {
        const canvas = this.createCanvas();
        container.appendChild(canvas);
        const animationContext = canvas.getContext('2d');
        if (fillStyle !== null && fillStyle !== undefined) {
            animationContext.fillStyle = fillStyle;
        }
        return animationContext;
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        return canvas;
    }

    generateParticles(count, particleFactory) {
        const particles = [];
        for (let _ = 0; _ < count; _ += 1) {
            particles.push(
                particleFactory(this.canvasWidth, this.canvasHeight, particles.length),
            );
        }
        return particles;
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

    animate() {
        this.fpsDisplay.updateFps(performance.now());
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
