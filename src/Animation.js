import {
    START_COUNT,
    PROXIMITY,
    PARTICLE_CONTEXT_FILLSTYLE,
    PARTICLE_FILLSTYLE,
} from './constants';
import { Particle } from './Particle';
import { KdTree } from './KdTree';
import { Rect } from './Rect';
import StatDisplay from './StatDisplay';


class Animation {
    constructor(particleContextContainer, lineContextContainer) {
        this.statDisplay = new StatDisplay(document.querySelector('#fps'));
        this.canvasWidth = particleContextContainer.clientWidth;
        this.canvasHeight = particleContextContainer.clientHeight;
        this.particleContext = this.createAnimationContext(
            particleContextContainer,
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
        let particleCounter = 0;
        while (particleCounter < count) {
            particles.push(
                particleFactory(this.canvasWidth, this.canvasHeight, particles.length),
            );
            particleCounter += 1;
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

    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit+1)); }

    static gaussianRand() {
        // https://stackoverflow.com/a/39187274
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
        this.statDisplay.updateFps(performance.now());
        const tree = new KdTree();
        this.populateNewTree(tree);

        this.clearCanvas();

        // main anim loop
        this.particleContext.fillStyle = PARTICLE_FILLSTYLE;
        this.particleContext.beginPath();
        let i = 0;
        while (i < this.particles.length) {
            this.setNearestNeighboursIfNull(this.particles[i], tree);
            this.alignParticleWithNeighbours(this.particles[i], tree);
            this.particles[i].avoidCollision();
            this.particles[i].performCollision();
            this.particles[i].applyForce(this.particles[i].getResistance());
            this.getBoundaryReflection(this.particles[i]);
            this.particles[i].move();
            Animation.drawParticle(this.particles[i], this.particleContext, 50);
            i += 1;
        };
        this.particleContext.fill();
        if (this.doAnim) {
            window.requestAnimationFrame(() => this.animate());
        }
    }

    populateNewTree(tree) {
        let i = 0;
        while (i < this.particles.length) {
            this.particles[i].nearest = null;
            tree.insert(this.particles[i]);
            i += 1;
        };
    }

    clearCanvas() {
        this.particleContext.fillStyle = PARTICLE_CONTEXT_FILLSTYLE;
        this.particleContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    setNearestNeighboursIfNull(particle, tree) {
        if (particle.nearest === null) {
            particle.setNearestNeighbour(particle.getNearestNeighbour(tree));
            particle.nearest.setNearestNeighbour(particle);
        }
    }

    alignParticleWithNeighbours(particle, tree) {
        const neighbours = particle.getNeighbours(tree);
        if (neighbours !== null && particle !== undefined) {
            particle.alignWithNeighbours(neighbours);
        }
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
