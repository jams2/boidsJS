import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';
import { Node, KdTree, equalPoints, comparePosition, distanceSquared } from './KdTree'; 
import { AudioSource } from './AudioSource';
import { Rect } from './Rect';
import { Vector } from './Vector';
import { Particle } from './Particle';
import { Animation } from './Animation';
import { Circle } from './Circle';


window.addEventListener("load", function() {
    const particleContextContainer = document.querySelector('#particle-container');
    const lineContextContainer = document.querySelector('#line-container');
    const anim = new Animation(particleContextContainer, lineContextContainer);
    anim.animate();
});
