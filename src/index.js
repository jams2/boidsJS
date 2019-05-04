import { Animation } from './Animation';


window.addEventListener('load', () => {
    const particleContextContainer = document.querySelector('#particle-container');
    const lineContextContainer = document.querySelector('#line-container');
    const anim = new Animation(particleContextContainer, lineContextContainer);
    anim.animate();
});
