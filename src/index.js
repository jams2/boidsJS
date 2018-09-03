import { MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C } from './constants';
import { Node, KdTree, equalPoints, comparePosition, distanceSquared } from './KdTree'; 
import { AudioSource } from './AudioSource';
import { Rect } from './Rect';
import { Vector } from './Vector';
import { Point } from './Point';
import { Animation } from './Animation';
import { Circle } from './Circle';


window.addEventListener("load", function() {
    const container0 = document.querySelector('#container0');
    const container1 = document.querySelector('#container1');
    const anim = new Animation(container0, container1);
    anim.animate();
});