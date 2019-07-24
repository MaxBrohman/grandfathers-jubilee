import App from './app';
import { data } from './data';
import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Raycaster
} from 'three';

// creating all necessary three js instances
const camera =  new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20000);
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
        app.act();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    };
    update();
});

window.addEventListener('click', app.mouseEventHandler);