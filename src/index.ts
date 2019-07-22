import App from './app';
import { data } from './data';
import * as TWEEN from '@tweenjs/tween.js';
import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Raycaster
} from 'three';

// creating all necessary three js instances
const camera =  new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
const scene = new Scene();
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const raycaster = new Raycaster();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearAlpha(0.0);
document.body.appendChild(renderer.domElement);

const app = new App(scene, camera, renderer, raycaster, data);
app.init()
.then(result => {
    app.render();
    const video = app.controller.video;
    const update = (): void => {
        TWEEN.update();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
        app.controller.process(video);
    };
    update();
});

window.addEventListener('click', app.mouseEventHandler);