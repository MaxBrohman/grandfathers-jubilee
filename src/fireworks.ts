declare const THREE: any;

export default class Fireworks{
    private fireworks: Firework[] = [];
    private scene: THREE.Scene;
    constructor(scene: THREE.Scene){
        this.scene = scene;
        this.draw = this.draw.bind(this);
    }

    public draw(): void{
        if(THREE.Math.randInt(1,20) === 10){
            this.fireworks.push(new Firework(this.scene));
        }
        for(let i = 0; i < this.fireworks.length; i++){
            if(this.fireworks[i].done){
                this.fireworks.splice(i, 1);
                continue;
            }
            this.fireworks[i].update();
        }
    }
}

class Firework {
    public done: boolean = false;
    private dest: any[] = [];
    private colors: any [] = [];
    private material: THREE.PointsMaterial;
    private scene: THREE.Scene;
    private geometry: THREE.Geometry = new THREE.Geometry();
    private points: THREE.Points;
    constructor(scene: THREE.Scene){
        this.material = new THREE.PointsMaterial({
            size: 16,
            color: 0xffffff,
            opacity: 1,
            transparent: true,
            depthTest: false,
            vertexColors: THREE.VertexColors
        });
        this.scene = scene;
        this.points = new THREE.Points(this.geometry, this.material);
        this.launch();
    }

    public update(): void{
        if(this.points && this.geometry){
            const total = this.geometry.vertices.length;
            // lerp particle positions 
            for(let i = 0; i < total; i++){
                const currentVert = this.geometry.vertices[i];
                const currentDest = this.dest[i];

                currentVert.x += (currentDest.x - currentVert.x) / 20;

                currentVert.y += (currentDest.y - currentVert.y) / 20;

                currentVert.z += (currentDest.z - currentVert.z) / 20;

                this.geometry.verticesNeedUpdate = true;
            }

            // watch first particle for explosion 
            if(total === 1){
                const firstVert = this.geometry.vertices[0];
                if(THREE.Math.ceilPowerOfTwo(firstVert.y) > (this.dest[0].y - 20)){
                    this.explode(firstVert);
                    return;
                }
            }

            // fade out exploded particles
            if(total > 1){
                this.material.opacity -= 0.015; 
                this.geometry.colorsNeedUpdate = true;
            }

            // remove, reset and stop animating 
            if(this.material.opacity <= 0){
                this.reset(); 
                this.done = true; 
                return; 
            }
        }
    }

    private launch(): void{
        const width = window.innerWidth;
        const x = THREE.Math.randInt(-width, width);
        const y = THREE.Math.randInt(100, 800);
        const z = THREE.Math.randInt(-1000, -3000);

        const from = new THREE.Vector3(x, -800, z);
        const to = new THREE.Vector3(x, y, z);

        const color = new THREE.Color();
        color.setHSL(THREE.Math.randFloat(0.1, 0.9), 1, 0.9);
        this.colors.push(color);
        this.geometry.colors = this.colors;
        this.geometry.vertices.push(from);
        this.dest.push(to);
        this.colors.push(color);
        this.scene.add(this.points);
    }

    private explode(vector: THREE.Vector3): void{
        this.scene.remove(this.points);
        this.dest = [];
        this.colors = [];
        this.geometry = new THREE.Geometry();
        this.points = new THREE.Points(this.geometry, this.material);
        for(let i = 0; i < 80; i++){
            const color = new THREE.Color();
            color.setHSL(THREE.Math.randFloat(0.1, 0.9), 1, 0.5);
            this.colors.push(color);
            const from = new THREE.Vector3(
                THREE.Math.randInt(vector.x - 10, vector.x + 10),
                THREE.Math.randInt(vector.y - 10, vector.y + 10),
                THREE.Math.randInt(vector.z - 10, vector.z + 10)
            );
            const to = new THREE.Vector3(
                THREE.Math.randInt(vector.x - 1000, vector.x + 1000),
                THREE.Math.randInt(vector.y - 1000, vector.y + 1000),
                THREE.Math.randInt(vector.z - 1000, vector.z + 1000)
            );
            this.geometry.vertices.push(from);
            this.dest.push(to);
        }
        this.geometry.colors = this.colors;
        this.scene.add(this.points);
    }

    private reset(): void{
        this.scene.remove(this.points);
        this.dest = [];
        this.colors = [];
        (this.geometry as any) = null;
        (this.points as any) = null;
    }
}