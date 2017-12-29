import {MovingObject} from "../game-object";

let CANNON = require('cannon');

export class Vehicle extends MovingObject {
    constructor(dataPath) {
        super(dataPath);
        this.mass = 100;
        this.wheelMaterial =  new CANNON.Material("wheelMaterial");
    }

    initializeVehicle() {
        this.chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1,0.5));
        this.chassisBody = new CANNON.Body({ mass: this.mass });
        this.body = this.chassisBody;  // for rendering
        this.chassisBody.addShape(this.chassisShape);
        this.chassisBody.position.set(0, 0, 4);
        this.chassisBody.angularVelocity.set(0, 0, 0.5);

        let options = {
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
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
        });

        options.chassisConnectionPointLocal.set(1, 1, 0);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(1, -1, 0);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, 1, 0);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, -1, 0);
        this.vehicle.addWheel(options);



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
    }
}


