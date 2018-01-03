
export class Scene {
    constructor() {
        this.objects=[];
    }

    add(gameObject) {
        this.objects.push(gameObject);
    }

    render() {
        for(var i=0; i<this.objects.length; i++){
            this.objects[i].render();
        }
    }

}