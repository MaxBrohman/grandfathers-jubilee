import PhotoMesh, { PMOptions } from './photo-mesh';
import {
    Group,
    Matrix4,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Raycaster,
    Vector2,
    Vector3,
    Object3D,
    Clock
} from 'three';
import Controller from './controller';
import { Fireworks } from './fireworks';

export default class App{
    public renderer: WebGLRenderer;
    public controller: Controller = new Controller();
    private scene: Scene;
    private camera: PerspectiveCamera;
    private raycaster: Raycaster;
    private data: PMOptions[];
    private fireworks: Fireworks | undefined;
    private actions: Array<() => void> = [];
    private meshes: Mesh[] = [];
    private usedMeshes: Mesh[] = [];
    private wrapper: Group = new Group();
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

        this.act = this.act.bind(this);
    }

    // creates all meshes and puts them on meshes property array
    public async init(): Promise<any> {
        this.data.forEach(img => {
            const newMesh = new PhotoMesh(img).init();
            newMesh.scale.set(0.000001, 0.000001, 0.000001);
            this.meshes.push(newMesh);
        });
        this.scene.add(this.camera);
        this.camera.lookAt(this.scene.position);
        this.camera.position.z = 5;
        const videoElem = await this.controller.init(this.camera);
        const root = await this.controller.setMarker('./pattern-marker.patt');
        this.onResize();
        window.addEventListener('resize', () => {
            this.onResize();
        });
        root.add(this.wrapper);
        root.visible = false;
        this.scene.add(root);
        this.controller.ar!.addEventListener('getMarker', (evt) => {
            const marker = evt.data.marker;
            const markerRoot = this.controller.ar!.threePatternMarkers[marker.idPatt];
            if(markerRoot){
                const newMat = new Matrix4().fromArray(evt.data.matrixGL_RH);
                markerRoot.matrix.copy(newMat);
                markerRoot.visible = true;
            } else {
                root.visible = false;
            }
        });
        this.actions.push(this.controller.process);
    }

    // adds mesh to scene, animates and translate mesh from meshes property array to usedMeshes property array
    public render(position?: Vector3): void{
        if(this.meshes.length === 1){
            if(!this.fireworks){
                this.fireworks = new Fireworks(this.scene);
                this.actions.push(this.fireworks.draw);
            }
        }
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
        this.animateScale(mesh);
    }

    public act(): void{
        this.actions.forEach(action => {
            action();
        });
    }

    // click logic
    public mouseEventHandler(evt: MouseEvent): void{
        const mouse = new Vector2(
            (evt.clientX / window.innerWidth) * 2 - 1,
            -(evt.clientY / window.innerHeight) * 2 + 1
        );
        
        this.raycaster.setFromCamera(mouse, this.camera);

        // if mesh cicked, hides it
        const intersects = this.raycaster.intersectObjects(this.wrapper.children);
        if (intersects.length > 0) {
            const maxScaleAfterAnimation = 0.999999;
            const clickedMesh = intersects[0].object;
            if(clickedMesh.scale.x < maxScaleAfterAnimation || clickedMesh.scale.y < maxScaleAfterAnimation){
                console.log('here', clickedMesh.scale.x);
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

    
    // animates and removes mesh from scene
    private hide(mesh: Mesh | Object3D): void{
        this.animateScale((mesh as Mesh)).then(() => {
            this.wrapper.remove(mesh);
        }); 
    }

    private onResize(): void {
        this.controller.onVideoResize();
        if(window.innerHeight > window.innerWidth){
            this.wrapper.rotation.x = -(Math.PI * 0.25);
            this.wrapper.scale.set(1, 1, 1);
        } else{
            this.wrapper.rotation.x = 0;
            this.wrapper.scale.set(1.3, 1.3, 1.3);
        }
        this.controller.onWindowResize(this.camera, this.renderer);
    }

    // animate scale depending on current mesh scale
    private animateScale(mesh: Mesh): Promise<boolean>{
        return new Promise((resolve) => {

            let clock: Clock | null = new Clock();
            const duration = 0.8;
            const to = mesh.scale.x - 1;
            const from = -mesh.scale.x;

            const animate = () => {
                const animationTime = clock!.getElapsedTime();
                const step = animationTime / duration;

                if(animationTime >= duration){
                    resolve(true);
                    clock = null;
                    const limit = Math.abs(to);
                    mesh.scale.set(limit, limit, 0.000001);
                    return;
                }
                
                const value = Math.abs(from + step);
                mesh.scale.set(value, value, 0.000001);

                requestAnimationFrame(animate);
            };
            animate();
        });
        
    }
};