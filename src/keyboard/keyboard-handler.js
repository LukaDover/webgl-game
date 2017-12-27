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

export function initKeyboard() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

initKeyboard();
