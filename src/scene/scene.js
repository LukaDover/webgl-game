import {MovingObject, StationaryObject} from "../model/game-object";
var CANNON = require('cannon');

export class Scene {
    constructor() {
        this.objects = [];
    }

    add(gameObject) {
        this.objects.push(gameObject);
    }

    render() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].render();
        }
    }

    initScene(world) {
        //streetSide
        let leftbuilding = new StationaryObject('./blender/scene/right-building.obj');  //'./blender/textured-streetSide2.obj'
        leftbuilding.getTexture('./blender/textures/facade.jpg');
        leftbuilding.initializeBuffers();
        let leftbuildingBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(0, 0, -20)
        });
        let leftbuildingShape = new CANNON.Box(new CANNON.Vec3(600, 0.1, 10));
        leftbuildingBody.addShape(leftbuildingShape);
        leftbuilding.body = leftbuildingBody;
        leftbuilding.setPosition();
        world.add(leftbuildingBody);
        this.add(leftbuilding);

        //StreetSide
        let rightbuilding = new StationaryObject('./blender/scene/left-building.obj');
        rightbuilding.getTexture('./blender/textures/facade.jpg');
        rightbuilding.initializeBuffers();
        let rightbuildingBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(0, 0, -20)
        });
        let rightbuildingShape = new CANNON.Box(new CANNON.Vec3(600, 0.1, 10));
        rightbuildingBody.addShape(rightbuildingShape);
        rightbuilding.body = rightbuildingBody;
        rightbuilding.setPosition();
        world.add(rightbuildingBody);
        this.add(rightbuilding);
    }
}