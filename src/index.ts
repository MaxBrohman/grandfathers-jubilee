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
// seting canvas full screen
renderer.domElement.style.position = 'absolute';
document.body.style.margin = '0';
renderer.domElement.style.margin = '0';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearAlpha(0.0);
document.body.appendChild(renderer.domElement);

// changes canvas size and ratio
const resizeHandler = (): void => {
    const elem = renderer.domElement;

    const DEF_WIDTH = 640;
    const DEF_HEIGHT = 480;

    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight

    const aspectRatio = viewPortWidth / viewPortHeight;
    const sourceAspectRatio = DEF_WIDTH / DEF_HEIGHT;

    if(aspectRatio < sourceAspectRatio){
        const updatedWidth = sourceAspectRatio * viewPortHeight;

        elem.style.width = `${updatedWidth}px`;
        elem.style.left = `${-(updatedWidth - viewPortWidth)/2}px`;

        elem.style.height = `${viewPortHeight}px`;
        elem.style.top = '0px';
    } else {
        const updatedHeight = 1 / (sourceAspectRatio / viewPortWidth);

        elem.style.height = `${updatedHeight}px`;
        elem.style.top = `${-(updatedHeight - viewPortHeight)/2}px`;

        elem.style.width = `${viewPortWidth}px`;
        elem.style.left = '0px';
    }
};

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


window.addEventListener('resize', resizeHandler);

window.addEventListener('click', app.mouseEventHandler);