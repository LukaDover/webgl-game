import {MovingObject, StationaryObject} from "../model/game-object";
var CANNON = require('cannon');

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

    initScene(world){
        //streetSide
        let building1 = new StationaryObject('./blender/newSide.obj');  //'./blender/textured-streetSide2.obj'
        building1.getTexture('./blender/textures/buildings.jpg');
        building1.initializeBuffers();
        let building1Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(0, 30, -20),
        });
        let building1Shape = new CANNON.Box(new CANNON.Vec3(200,3,10));
        building1Body.addShape(building1Shape);
        building1.body = building1Body;
        building1.setPosition();
        world.add(building1Body);
        this.add(building1);

        //StreetSide
        let building2 = new StationaryObject('./blender/newSide.obj');
        building2.getTexture('./blender/textures/buildings.jpg');
        building2.initializeBuffers();
        let building2Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(0, -30, -20),
        });
        let building2Shape = new CANNON.Box(new CANNON.Vec3(200,3,10));
        building2Body.addShape(building2Shape);
        building2.body = building2Body;
        building2.setPosition();
        world.add(building2Body);
        this.add(building2);

        //StreetEnd
        let streetEnd = new StationaryObject('./blender/streetEnd.obj');
        streetEnd.getTexture('./blender/textures/buildings.jpg');
        streetEnd.initializeBuffers();
        let streetEndBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(-200, 0, -20),
        });
        let streetEndShape = new CANNON.Box(new CANNON.Vec3(3,60,10));
        streetEndBody.addShape(streetEndShape);
        streetEnd.body = streetEndBody;
        streetEnd.setPosition();
        world.add(streetEndBody);
        this.add(streetEnd);

        //StreetEnd
        let streetEnd2 = new StationaryObject('./blender/streetEnd.obj');
        streetEnd2.getTexture('./blender/textures/buildings.jpg');
        streetEnd2.initializeBuffers();
        let streetEndBody2 = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(200, 0, -20),
        });
        let streetEndShape2 = new CANNON.Box(new CANNON.Vec3(3,60,10));
        streetEndBody2.addShape(streetEndShape2);
        streetEnd2.body = streetEndBody2;
        streetEnd2.setPosition();
        world.add(streetEndBody2);
        this.add(streetEnd2);
    }

}