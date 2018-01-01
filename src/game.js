// Main loop of the game
import {glContext, initGL, initShaderProgram, pMatrix} from "./common/common";
import {MovingObject, StationaryObject} from "./model/game-object";
import {ShaderLoader} from "./shader/shader-loader";
import {Renderer} from "./render/renderer";
import {Vehicle} from "./model/vehicle/vehicle";
import {Handler} from "./interface/keyboard-handler";
import {initKeyboard} from "./interface/keyboard-handler";
import {Camera, MovingCamera} from "./model/camera/camera";
import {MouseHandler} from "./interface/mouse-handler";
var CANNON = require('cannon');



function simulation() {
    // Setup our world
    let world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // m/s²
    world.defaultContactMaterial.friction = 0;


    let vehicle = new Vehicle('./blender/textured-cube.obj');
    vehicle.initializeBuffers();
    vehicle.initializeVehicle();
    vehicle.getTexture('./blender/textures/wood.jpg');

// Create a plane
    let ground = new StationaryObject('./blender/textured-ground.obj');
    ground.getTexture('./blender/textures/tiles.jpg');
    ground.initializeBuffers();
    let groundBody = new CANNON.Body({
        mass: 0, // mass == 0 makes the body static
        position: new CANNON.Vec3(0, 0, -20),
        material:  new CANNON.Material("groundMaterial")
});
    let groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    ground.body = groundBody;
    ground.setPosition();
    world.add(groundBody);

    // Contact material
    let wheelGroundContactMaterial = new CANNON.ContactMaterial(
        vehicle.wheelMaterial,
        groundBody.material,
        {
            friction: 0.3,
            restitution: 0,
            contactEquationStiffness: 1000
        }
    );

    world.addContactMaterial(wheelGroundContactMaterial);

    vehicle.vehicle.addToWorld(world);

    let update = vehicle.update.bind(vehicle);
    world.addEventListener('postStep', update);
    let keyboardHandler = new Handler(vehicle.vehicle);
    initKeyboard(keyboardHandler);

    //tree
    let tree = new StationaryObject('./blender/textured-roundTree.obj');
    tree.getTexture('./blender/textures/wood.jpg');
    tree.initializeBuffers();
    let treeBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 10, -20)
    })
    let treeShape = new CANNON.Box(new CANNON.Vec3(1,1,5));
    treeBody.addShape(treeShape);
    tree.body = treeBody;
    tree.setPosition();
    world.add(treeBody);

    //house
    let house = new StationaryObject('./blender/house2.obj');
    house.getTexture('./blender/textures/wood.jpg');
    house.initializeBuffers();
    let houseBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(10, 10, -20)
    })
    let houseShape = new CANNON.Box(new CANNON.Vec3(3,3,5));
    houseBody.addShape(houseShape);
    house.body = houseBody;
    house.setPosition();
    world.add(houseBody);


    // Create a camera
    let camera = new MovingCamera(vehicle);

    let mouseHandler = new MouseHandler(camera);
    let handleEvent = mouseHandler.handleEvent.bind(mouseHandler);
    let handleScroll = mouseHandler.handleScroll.bind(mouseHandler);
    document.onmousemove = handleEvent;
    document.onwheel = handleScroll;

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

        lastTime = time;
        vehicle.transform();
        Renderer.drawScene();
        camera.setUniforms();
        ground.render();
        vehicle.render();
        tree.render();
        house.render();
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