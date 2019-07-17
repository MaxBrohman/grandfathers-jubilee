import PhotoMesh, { PMOptions } from './photo-mesh';
import * as TWEEN from '@tweenjs/tween.js';
import {
    AmbientLight,
    Group,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Raycaster,
    Vector2,
    Vector3,
    Object3D
} from 'three';

export default class App{
    public renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private raycaster: Raycaster;
    private data: PMOptions[];
    private meshes: Mesh[] = [];
    private usedMeshes: Mesh[] = [];
    private light: AmbientLight;
    private wrapper: Group;
    constructor(scene: Scene, 
        camera: PerspectiveCamera, 
        renderer: WebGLRenderer, 
        raycaster: Raycaster, 
        data: PMOptions[]){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = raycaster;
        this.data = data;
        this.mouseEventHandler = this.mouseEventHandler.bind(this);
        this.light = new AmbientLight();
        this.wrapper = new Group();
    }

    // creates all meshes and puts them on meshes property array
    init(): void{
        this.data.forEach(img => {
            const newMesh = new PhotoMesh(img).init();
            newMesh.scale.set(0, 0, 0);
            this.meshes.push(newMesh);
        });
        this.scene.add(this.camera);
        this.scene.add(this.light);
        this.scene.add(this.wrapper);
        this.camera.lookAt(this.scene.position);
        this.camera.position.z = 5;
    }

    // adds mesh to scene, animates and translate mesh from meshes property array to usedMeshes property array
    render(position?: Vector3): void{
        if(this.meshes.length === 0){
            this.meshes = [...this.usedMeshes];
            this.usedMeshes = [];
        }
        const mesh = this.meshes[0];
        this.wrapper.add(mesh);
        if(position){
            mesh.position.copy(position);
        }
        const showedMesh = this.meshes.shift();
        this.usedMeshes.push((showedMesh as Mesh));
        this.animateScale(mesh).start();
    }

    // animates and removes mesh from scene
    hide(mesh: Mesh | Object3D): void{
        this.animateScale((mesh as Mesh)).start().onComplete(() => {
            this.wrapper.remove(mesh);
        });
    }

    // click logic
    mouseEventHandler(evt: MouseEvent): void{
        const mouse = new Vector2(
            (evt.clientX / window.innerWidth) * 2 - 1,
            -(evt.clientY / window.innerHeight) * 2 + 1
        );
        
        this.raycaster.setFromCamera(mouse, this.camera);

        // if mesh cicked, hides it
        const intersects = this.raycaster.intersectObjects(this.wrapper.children);
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            if(clickedMesh.scale.x < 1 || clickedMesh.scale.y < 1){
                return;
            }
            this.hide(intersects[0].object);
            return;
        }

        // if empty space clicked, puts mesh on this.position
        const distance = - this.camera.position.z / this.raycaster.ray.direction.z;
        const newPosition = this.camera.position.clone().add(this.raycaster.ray.direction.multiplyScalar(distance));
        this.render(newPosition);
    }

    // animate scale depending on current mesh scale
    animateScale(mesh: Mesh):TWEEN.Tween{
        const DUR = 800;
        const from = { value: mesh.scale.x };
        const changeProp = () => {
            mesh.scale.set(from.value, from.value, from.value);
        };
        return new TWEEN.Tween(from).to({ value: Math.abs(mesh.scale.x - 1)  }, DUR).onUpdate(changeProp);
    }

};