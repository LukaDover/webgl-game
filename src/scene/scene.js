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
            position: new CANNON.Vec3(0, 16, -20)
        });
        let leftbuildingShape = new CANNON.Box(new CANNON.Vec3(600, 0.1, 10));
        leftbuildingBody.addShape(leftbuildingShape);
        leftbuilding.setInitialPosition([0, 0, -20], null, null);
        world.add(leftbuildingBody);
        this.add(leftbuilding);

        //StreetSide
        let rightbuilding = new StationaryObject('./blender/scene/left-building.obj');
        rightbuilding.getTexture('./blender/textures/facade.jpg');
        rightbuilding.initializeBuffers();
        rightbuilding.setInitialPosition([0, 0, -20], null, null);
        let rightbuildingBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(0, -16, -20)
        });
        let rightbuildingShape = new CANNON.Box(new CANNON.Vec3(600, 0.1, 10));
        rightbuildingBody.addShape(rightbuildingShape);

        world.add(rightbuildingBody);
        this.add(rightbuilding);

        //zombie
        let zombie = new StationaryObject('./blender/zombie.obj');
        zombie.getTexture('./blender/textures/zombie.png');
        zombie.initializeBuffers();
        zombie.setInitialPosition([20, 0, -20], null, null);
        let zombieBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(20, 0, -20)
        });
        let zombieShape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombieBody.addShape(zombieShape);

        world.add(zombieBody);
        this.add(zombie);

        //zombie2
        let zombie2 = new StationaryObject('./blender/zombie.obj');
        zombie2.getTexture('./blender/textures/zombie.png');
        zombie2.initializeBuffers();
        zombie2.setInitialPosition([40, 8, -20], null, null);
        let zombie2Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(40, 8, -20)
        });
        let zombie2Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie2Body.addShape(zombie2Shape);

        world.add(zombie2Body);
        this.add(zombie2);

        //zombie3
        let zombie3 = new StationaryObject('./blender/zombie.obj');
        zombie3.getTexture('./blender/textures/zombie.png');
        zombie3.initializeBuffers();
        zombie3.setInitialPosition([60, -10, -20], null, null);
        let zombie3Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(60, -10, -20)
        });
        let zombie3Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie3Body.addShape(zombie3Shape);

        world.add(zombie3Body);
        this.add(zombie3);

        //zombie4
        let zombie4 = new StationaryObject('./blender/zombie.obj');
        zombie4.getTexture('./blender/textures/zombie.png');
        zombie4.initializeBuffers();
        zombie4.setInitialPosition([80, 0, -20], null, null);
        let zombie4Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(80, 0, -20)
        });
        let zombie4Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie4Body.addShape(zombie4Shape);

        world.add(zombie4Body);
        this.add(zombie4);

        //zombie5
        let zombie5 = new StationaryObject('./blender/zombie.obj');
        zombie5.getTexture('./blender/textures/zombie.png');
        zombie5.initializeBuffers();
        zombie5.setInitialPosition([100, -6, -20], null, null);
        let zombie5Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(100, -6, -20)
        });
        let zombie5Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie5Body.addShape(zombie5Shape);

        world.add(zombie5Body);
        this.add(zombie5);

        //zombie6
        let zombie6 = new StationaryObject('./blender/zombie.obj');
        zombie6.getTexture('./blender/textures/zombie.png');
        zombie6.initializeBuffers();
        zombie6.setInitialPosition([120, 8, -20], null, null);
        let zombie6Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(120, 8, -20)
        });
        let zombie6Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie6Body.addShape(zombie6Shape);

        world.add(zombie6Body);
        this.add(zombie6);

        //zombie7
        let zombie7 = new StationaryObject('./blender/zombie.obj');
        zombie7.getTexture('./blender/textures/zombie.png');
        zombie7.initializeBuffers();
        zombie7.setInitialPosition([140, -3, -20], null, null);
        let zombie7Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(140, -3, -20)
        });
        let zombie7Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie7Body.addShape(zombie7Shape);

        world.add(zombie7Body);
        this.add(zombie7);

        //zombie8
        let zombie8 = new StationaryObject('./blender/zombie.obj');
        zombie8.getTexture('./blender/textures/zombie.png');
        zombie8.initializeBuffers();
        zombie8.setInitialPosition([160, 6, -20], null, null);
        let zombie8Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(160, 6, -20)
        });
        let zombie8Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie8Body.addShape(zombie7Shape);

        world.add(zombie8Body);
        this.add(zombie8);

        //zombie9
        let zombie9 = new StationaryObject('./blender/zombie.obj');
        zombie9.getTexture('./blender/textures/zombie.png');
        zombie9.initializeBuffers();
        zombie9.setInitialPosition([180, 0, -20], null, null);
        let zombie9Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(180, 0, -20)
        });
        let zombie9Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie9Body.addShape(zombie9Shape);

        world.add(zombie9Body);
        this.add(zombie9);

        //zombie10
        let zombie10 = new StationaryObject('./blender/zombie.obj');
        zombie10.getTexture('./blender/textures/zombie.png');
        zombie10.initializeBuffers();
        zombie10.setInitialPosition([200, -8, -20], null, null);
        let zombie10Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(200, -8, -20)
        });
        let zombie10Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie10Body.addShape(zombie10Shape);

        world.add(zombie10Body);
        this.add(zombie10);

        //zombie11
        let zombie11 = new StationaryObject('./blender/zombie.obj');
        zombie11.getTexture('./blender/textures/zombie.png');
        zombie11.initializeBuffers();
        zombie11.setInitialPosition([220, 7, -20], null, null);
        let zombie11Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(220, 7, -20)
        });
        let zombie11Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie11Body.addShape(zombie11Shape);

        world.add(zombie11Body);
        this.add(zombie11);

        //zombie12
        let zombie12 = new StationaryObject('./blender/zombie.obj');
        zombie12.getTexture('./blender/textures/zombie.png');
        zombie12.initializeBuffers();
        zombie12.setInitialPosition([240, 0, -20], null, null);
        let zombie12Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(240, 0, -20)
        });
        let zombie12Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie12Body.addShape(zombie12Shape);

        world.add(zombie12Body);
        this.add(zombie12);

        //zombie13
        let zombie13 = new StationaryObject('./blender/zombie.obj');
        zombie13.getTexture('./blender/textures/zombie.png');
        zombie13.initializeBuffers();
        zombie13.setInitialPosition([260, 6, -20], null, null);
        let zombie13Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(260, 6, -20)
        });
        let zombie13Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie13Body.addShape(zombie13Shape);

        world.add(zombie13Body);
        this.add(zombie13);

        //zombie14
        let zombie14 = new StationaryObject('./blender/zombie.obj');
        zombie14.getTexture('./blender/textures/zombie.png');
        zombie14.initializeBuffers();
        zombie14.setInitialPosition([280, -5, -20], null, null);
        let zombie14Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(280, -5, -20)
        });
        let zombie14Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie14Body.addShape(zombie14Shape);

        world.add(zombie14Body);
        this.add(zombie14);

        //zombie14 ta je pri 10em
        let zombie15 = new StationaryObject('./blender/zombie.obj');
        zombie15.getTexture('./blender/textures/zombie.png');
        zombie15.initializeBuffers();
        zombie15.setInitialPosition([200, 5, -20], null, null);
        let zombie15Body = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            position: new CANNON.Vec3(200, 5, -20)
        });
        let zombie15Shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 2));
        zombie15Body.addShape(zombie15Shape);

        world.add(zombie15Body);
        this.add(zombie15);

        //end
        let end = new StationaryObject('./blender/end.obj');
        end.getTexture('./blender/textures/end.png');
        end.initializeBuffers();
        end.setInitialPosition([295, 3, -20], null, null);
        this.add(end);
    }
}