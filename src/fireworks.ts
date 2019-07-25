import {
    Scene, 
    PointsMaterial, 
    Math, 
    Vector3, 
    Color, 
    Geometry, 
    Points, 
    VertexColors
} from 'three';

export default class Fireworks{
    private fireworks: Firework[] = [];
    private scene: Scene;
    constructor(scene: Scene){
        this.scene = scene;
        this.draw = this.draw.bind(this);
    }

    public draw(): void{
        if(Math.randInt(1,20) === 10){
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
    private material: PointsMaterial;
    private scene: Scene;
    private geometry: Geometry = new Geometry();
    private points: Points;
    constructor(scene: Scene){
        this.material = new PointsMaterial({
            size: 16,
            color: 0xffffff,
            opacity: 1,
            transparent: true,
            depthTest: false,
            vertexColors: VertexColors
        });
        this.scene = scene;
        this.points = new Points(this.geometry, this.material);
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
                if(Math.ceilPowerOfTwo(firstVert.y) > (this.dest[0].y - 20)){
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
        const x = Math.randInt(-width, width);
        const y = Math.randInt(100, 800);
        const z = Math.randInt(-1000, -3000);

        const from = new Vector3(x, -800, z);
        const to = new Vector3(x, y, z);

        const color = new Color();
        color.setHSL(Math.randFloat(0.1, 0.9), 1, 0.9);
        this.colors.push(color);
        this.geometry.colors = this.colors;
        this.geometry.vertices.push(from);
        this.dest.push(to);
        this.colors.push(color);
        this.scene.add(this.points);
    }

    private explode(vector: Vector3): void{
        this.scene.remove(this.points);
        this.dest = [];
        this.colors = [];
        this.geometry = new Geometry();
        this.points = new Points(this.geometry, this.material);
        for(let i = 0; i < 80; i++){
            const color = new Color();
            color.setHSL(Math.randFloat(0.1, 0.9), 1, 0.5);
            this.colors.push(color);
            const from = new Vector3(
                Math.randInt(vector.x - 10, vector.x + 10),
                Math.randInt(vector.y - 10, vector.y + 10),
                Math.randInt(vector.z - 10, vector.z + 10)
            );
            const to = new Vector3(
                Math.randInt(vector.x - 1000, vector.x + 1000),
                Math.randInt(vector.y - 1000, vector.y + 1000),
                Math.randInt(vector.z - 1000, vector.z + 1000)
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