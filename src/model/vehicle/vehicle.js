import {ChildObject, MovingObject} from "../game-object";
import {DUMMYPATH} from "../../common/path";
import {degToRad} from "../../common/common";

let mat4 = require('gl-matrix').mat4;

let CANNON = require('cannon');

export class Vehicle extends MovingObject {
    constructor(dataPath) {
        super(dataPath);
        this.mass = 500;
        this.wheelMaterial =  new CANNON.Material("wheelMaterial");
    }

    initializeVehicle() {
        this.chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1,0.5));
        this.chassisBody = new CANNON.Body({ mass: this.mass });
        this.body = this.chassisBody;  // for rendering
        this.chassisBody.addShape(this.chassisShape);
        this.chassisBody.position.set(0, 0, 4);
        this.chassisBody.angularVelocity.set(0, 0, 0.5);

        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
        });

        this.addWheels();

        this.wheelBodies = [];
        for(let i=0; i<this.vehicle.wheelInfos.length; i++){
            let wheel = this.vehicle.wheelInfos[i];
            let cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            let wheelBody = new CANNON.Body({ mass: 1 });
            let q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
            this.wheelBodies.push(wheelBody);
        }
        this.frontRightWheel.body = this.wheelBodies[0];
    }

    // Order in which the wheels are added matters
    addWheels() {
        this.frontRightWheel = new FrontRightWheel('./blender/vehicle/right-tire.obj');
        this.frontRightWheel.initializeBuffers();
        this.backRightWheel = new BackRightWheel(DUMMYPATH);
        this.frontLeftWheel = new FrontLeftWheel(DUMMYPATH);
        this.backLeftWheel = new BackLeftWheel(DUMMYPATH);

        this.vehicle.addWheel(this.frontRightWheel.attributes);
        this.vehicle.addWheel(this.frontLeftWheel.attributes);
        this.vehicle.addWheel(this.backRightWheel.attributes);
        this.vehicle.addWheel(this.backLeftWheel.attributes);
        console.log(this.vehicle.wheelInfos)
    }

    update() {
        for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i);
            let t = this.vehicle.wheelInfos[i].worldTransform;
            this.wheelBodies[i].position.copy(t.position);
            this.wheelBodies[i].quaternion.copy(t.quaternion);
        }
    }

    render() {
        super.render();
        this.frontRightWheel.render();
    }

    transform() {
        super.transform();
        this.frontRightWheel.transform();
    }
}

export class Wheel extends MovingObject {
    constructor(dataPath, chassisConnectionPointsLocal) {
        super(dataPath);
        this.body = new CANNON.Body({ mass: 1 });
        this.attributes = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence:  0.01,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: chassisConnectionPointsLocal,
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        }
    }
}

class FrontLeftWheel extends Wheel {
    constructor(dataPath) {
        super(dataPath, new CANNON.Vec3(1, 1, 0));
    }
}

class FrontRightWheel extends Wheel {
    constructor(dataPath) {
        super(dataPath, new CANNON.Vec3(1, -1, 0));
    }

    _rotate() {
        super._rotate();
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, degToRad(90), [0, 0, 1]);
    }

    _translate() {
        super._translate();
        mat4.translate(this.translationMatrix, this.translationMatrix,)
    }


}

class BackLeftWheel extends Wheel {
    constructor(dataPath) {
        super(dataPath, new CANNON.Vec3(-1, 1, 0));

    }
}

class BackRightWheel extends Wheel {
    constructor(dataPath) {
        super(dataPath, new CANNON.Vec3(-1, -1, 0));

    }
}
