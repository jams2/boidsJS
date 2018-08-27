import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';
import { Node, KdTree, equalPoints, compareDouble, distanceSquared } from './KdTree'; 
import { AudioSource } from './AudioSource';
import { Rect } from './Rect';
import { Vector } from './Vector';
import { Point } from './Point';
import { Animation } from './Animation';


window.addEventListener("load", function() {
    const container0 = document.querySelector('#container0');
    const container1 = document.querySelector('#container1');
    const analyser = new AudioSource();
    const anim = new Animation(container0, container1, analyser);
    anim.animate();
});
