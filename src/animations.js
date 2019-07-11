import * as TWEEN from '@tweenjs/tween.js';

export const animateMeshScale = (mesh) => {
    const DUR = 800;
    const start = { value: 0 };
    const changeProp = () => {
        mesh.scale.set(start.value, start.value, start.value);
    };
    return new TWEEN.Tween(start).to({ value: 1 }, DUR).onUpdate(changeProp);
};