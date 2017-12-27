// Main loop of the game
import {glContext, initGL, initShaderProgram, pMatrix} from "./common/common";
import * as keyboard from './keyboard/keyboard-handler';
import {MovingObject} from "./model/game-object";
import {ShaderLoader} from "./shader/shader-loader";
var CANNON = require('cannon');



function simulation() {
    // Setup our world
    let world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // m/s²

// Create a cube
    let cubeBody = new CANNON.Body({
        mass: 5, // kg
        position: new CANNON.Vec3(0, 0, 10), // m
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    });
    world.add(cubeBody);

    let cube = new MovingObject('./blender/cube.obj');
    cube.initializeBuffers();
    cube.body = cubeBody;

// Create a plane
    let groundBody = new CANNON.Body({
        mass: 0, // mass == 0 makes the body static
        position: new CANNON.Vec3(0, 0, -20)
});
    let groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    world.add(groundBody);

    let fixedTimeStep = 1.0 / 60.0; // seconds
    let maxSubSteps = 3;

// Start the simulation loop
    let lastTime;
    (function simloop(time){
        requestAnimationFrame(simloop);
        if(lastTime !== undefined){
            let dt = (time - lastTime) / 1000;
            world.step(fixedTimeStep, dt, maxSubSteps);
        }

        cube.body.applyForce(keyboard.computeForce(), cube.body.position);
        lastTime = time;
        cube.transform();
        cube.render();
    })();
}

function start() {

    initGL();
    initShaderProgram();

    let shaderLoader = new ShaderLoader();
    shaderLoader.initShaders();

    simulation();
}

window.onload=start;