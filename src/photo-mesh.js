// image plane class
export default class PhotoMesh{
    constructor(options){
        this.texture = new THREE.TextureLoader().load(options.img);
        this.size = options.size;
        this.scale = options.scale;
    }
    // sets image as texture
    init(){
        const geometry = new THREE.PlaneGeometry(
            this.size.width * this.scale,
            this.size.height * this.scale
        );
        const material = new THREE.MeshBasicMaterial({
            map: this.texture
        });
        return new THREE.Mesh(geometry, material);
    }
};