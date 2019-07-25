import { PMOptions, OptionsSize } from './typings/photo-mesh';
declare const THREE: any;

// image plane class
export default class PhotoMesh{
    private texture: THREE.Texture;
    private size: OptionsSize;
    private scale: number;
    constructor(options: PMOptions){
        this.texture = new THREE.TextureLoader().load(options.img);
        this.size = options.size;
        this.scale = options.scale;
    }
    // sets image as texture
    init(): THREE.Mesh{
        const geometry = new THREE.PlaneGeometry(
            this.size.width * this.scale,
            this.size.height * this.scale
        );
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            depthWrite: false,
            alphaTest: 0.5
        });
        return new THREE.Mesh(geometry, material);
    }
};