import {degToRad} from "../common/common";


export class MouseHandler {
    constructor(camera) {
        this.lastX = 0;
        this.lastY = 0;
        this.camera = camera;
    }

    handleEvent(event) {
        // transforms the view matrix
        let x = event.clientX;
        let y = event.clientY;

        let deltaX = -(x - this.lastX);
        let deltaY = -(y - this.lastY);

        this.lastX = x;
        this.lastY = y;

        this.camera.rotate(degToRad(deltaX / 10), [0, 1, 0]);
        this.camera.rotate(degToRad(deltaY / 10), [1, 0, 0]);
    }
}

export class Handler {
    constructor(vehicle) {
        this.vehicle = vehicle;
    }

    handleEvent(event){
        let maxSteerVal = 0.5;
        let maxForce = 1000;
        let brakeForce = 1000000;

        let up = (event.type == 'keyup');

        if(!up && event.type !== 'keydown'){
            return;
        }

        this.vehicle.setBrake(0, 0);
        this.vehicle.setBrake(0, 1);
        this.vehicle.setBrake(0, 2);
        this.vehicle.setBrake(0, 3);

        switch(event.keyCode){

            case 38: // forward
                this.vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
                this.vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
                break;

            case 40: // backward
                this.vehicle.applyEngineForce(up ? 0 : maxForce, 2);
                this.vehicle.applyEngineForce(up ? 0 : maxForce, 3);
                break;

            case 66: // b
                this.vehicle.setBrake(brakeForce, 0);
                this.vehicle.setBrake(brakeForce, 1);
                this.vehicle.setBrake(brakeForce, 2);
                this.vehicle.setBrake(brakeForce, 3);
                break;

            case 39: // right
                this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0);
                this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1);
                break;

            case 37: // left
                this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0);
                this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1);
                break;

        }
    }
}

export function initKeyboard(handler) {
    let methodRef = handler.handleEvent.bind(handler);
    document.onkeydown = methodRef;
    document.onkeyup = methodRef;
}

