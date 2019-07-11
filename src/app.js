import PhotoMesh from './photo-mesh';
import * as TWEEN from '@tweenjs/tween.js';

export default class App{
    constructor(scene, camera, renderer, raycaster, data){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = raycaster;
        this.data = data;
        this.meshes = [];
        this.mouseEventHandler = this.mouseEventHandler.bind(this);
        this.usedMeshes = [];
        this.light = new THREE.AmbientLight();
    }

    // creates all meshes and puts them on meshes property array
    init(){
        this.data.forEach(img => {
            const newMesh = new PhotoMesh(img).init();
            newMesh.scale.set(0, 0, 0);
            this.meshes.push(newMesh);
        });
        this.scene.add(this.camera);
        this.scene.add(this.light);
        this.camera.lookAt(this.scene.position);
        this.camera.position.z = 5;
    }

    // adds mesh to scene, animates and translate mesh from meshes property array to usedMeshes property array
    render(position){
        if(this.meshes.length === 0){
            this.meshes = [...this.usedMeshes];
            this.usedMeshes = [];
        }
        const mesh = this.meshes[0];
        this.scene.add(mesh);
        if(position){
            mesh.position.copy(position);
        }
        this.animateScale(mesh).start().onComplete(() => {
            const showedMesh = this.meshes.shift();
            this.usedMeshes.push(showedMesh);
        });
    }

    // animates and removes mesh from scene
    hide(mesh){
        this.animateScale(mesh).start().onComplete(() => {
            this.scene.remove(mesh);
        });
    }

    // click logic
    mouseEventHandler(evt){
        const mouse = new THREE.Vector2(
            (evt.clientX / window.innerWidth) * 2 - 1,
            -(evt.clientY / window.innerHeight) * 2 + 1
        );
        
        this.raycaster.setFromCamera(mouse, this.camera);

        // if mesh cicked, hides it
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            this.hide(intersects[0].object);
            return;
        }

        // if empty space clicked, puts mesh on this.position
        const distance = - this.camera.position.z / this.raycaster.ray.direction.z;
        const newPosition = this.camera.position.clone().add(this.raycaster.ray.direction.multiplyScalar(distance));
        this.render(newPosition);
    }

    // animate scale depending on current mesh scale
    animateScale(mesh){
        const DUR = 800;
        const from = { value: mesh.scale.x };
        const changeProp = () => {
            mesh.scale.set(from.value, from.value, from.value);
        };
        return new TWEEN.Tween(from).to({ value: Math.abs(mesh.scale.x - 1)  }, DUR).onUpdate(changeProp);
    }

};