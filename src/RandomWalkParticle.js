import Particle from './Particle';
import { MAX_SPEED } from './constants';
import { Vector } from './Vector';

const MAX_MOVE = 25;


class RandomWalkParticle extends Particle {
    constructor(x, y, id) {
        super(x, y, id);
        this.mass = 35;
    }

    move() {
        this.position.x += Math.floor(
            (Math.random() * MAX_MOVE) * ((Math.random() > 0.49) ? 1 : -1)
        );
        this.position.y += Math.floor(
            (Math.random() * MAX_MOVE) * ((Math.random() > 0.49) ? 1 : -1)
        );
    }
}


export default RandomWalkParticle;
