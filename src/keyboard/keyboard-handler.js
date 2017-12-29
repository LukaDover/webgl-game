import {responseForce} from "../player/settings";
var CANNON = require('cannon');

export var currentlyPressedKeys = {};

export function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

export function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

export function computeForce() {
    let force = new CANNON.Vec3(0, 0, 0);

    if (currentlyPressedKeys[37]) force.x -= responseForce; // Left
    if (currentlyPressedKeys[39]) force.x += responseForce; // Right
    if (currentlyPressedKeys[38]) force.y -= responseForce; // Up
    if (currentlyPressedKeys[40]) force.y += responseForce; // Down
    if (currentlyPressedKeys[33]) force.z += responseForce; // Page Up
    if (currentlyPressedKeys[34]) force.z -= responseForce; // Page Down

    return force;
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

