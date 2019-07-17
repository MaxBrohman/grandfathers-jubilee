declare module '@tweenjs/tween.js' {
  export class Tween {
    constructor(object: any);

    public to (properties: any, duration: number) : this;
    public start (time?: string | number) : this;
    public onUpdate (callback: () => void) : this;
    public onComplete (callback: () => void) : this;
  }
  export function update (time?: any, preserve?: any) : boolean;
}

